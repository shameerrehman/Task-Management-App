import boto3
import os
import json
import hmac, hashlib, base64  # for hashing


def lambda_handler(event, context):
    # Handle OPTIONS
    if event["requestContext"]["http"]["method"] == "OPTIONS":
        return {
            "statusCode": 200,
            "body": "",
        }

    try:
        client = boto3.client("cognito-idp")
        CLIENT_ID = os.environ["CLIENT_ID"]

        # Check if the body exists in the event
        if "body" not in event:
            return {
                "statusCode": 400,
                "body": json.dumps({"message": "No body in the request"}),
            }
        event_body = json.loads(event["body"])
        username = event_body["username"]
        CLIENT_SECRET = os.environ["CLIENT_SECRET"]
        secret_hash = get_secret_hash(username, CLIENT_ID, CLIENT_SECRET)
        if "verification_code" in event_body:
            response = client.confirm_sign_up(
                ClientId=CLIENT_ID,
                SecretHash=secret_hash,
                Username=username,
                ConfirmationCode=event_body["verification_code"]
            )
            return {
                "statusCode": 200,
                "body": json.dumps(response),
            } 
        if "resend_code" in event_body:
            response = client.resend_confirmation_code(
                ClientId=CLIENT_ID,
                Username=username,
                SecretHash=secret_hash
            )
            return {
                "statusCode": 200,
                "body": json.dumps(response),
            } 
        # Check for required fields in the body
        for key in ["username", "password"]:
            if key not in event_body:
                return {
                    "statusCode": 400,
                    "body": json.dumps({"message": f"Missing {key} in request body"}),
                }

        password = event_body["password"]
        name = event_body["name"]
        email = event_body["email"]
        
        

        response = client.sign_up(
            ClientId=CLIENT_ID,
            SecretHash=secret_hash,
            Username=username,
            Password=password,
            UserAttributes=[
                {"Name": "name", "Value": name},
                {"Name": "email", "Value": email},
            ],
        )

        return {
            "statusCode": 200,
            "body": json.dumps(response),
        }

    except client.exceptions.UsernameExistsException as e:
        return {
            "statusCode": 400,
            "body": json.dumps({"message": f"User already exists with inputted username. More Info {str(e)}"}),
        }        

    except client.exceptions.InvalidPasswordException as e:
        return {
            "statusCode": 400,
            "body": json.dumps({"message": f"Password does not meet requirements. More Info {str(e)}"}),
        }        

    except client.exceptions.CodeMismatchException as e:
        return {
            "statusCode": 400,
            "body": json.dumps({"message": f"Verification code does not match. More Info {str(e)}"}),
        }        

    except client.exceptions.ExpiredCodeException as e:
        return {
            "statusCode": 400,
            "body": json.dumps({"message": f"Verification code expired, please request another one. More Info {str(e)}"}),
        }  
          
    except client.exceptions.TooManyFailedAttemptsException as e:
        return {
            "statusCode": 400,
            "body": json.dumps({"message": f"Too many failed attempts. More Info {str(e)}"}),
     }        

    except client.exceptions.TooManyRequestsException as e:
        return {
            "statusCode": 400,
            "body": json.dumps({"message": f"Too many requests. More Info {str(e)}"}),
     }        


    except client.exceptions.UserNotFoundException as e:
        return {
            "statusCode": 400,
            "body": json.dumps({"message": f"User not found. More Info {str(e)}"}),
     }        


    except client.exceptions.ClientError as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"message": f"Cognito error: {str(e)}"}),
        }
    except Exception as e:
        # General error handling
        return {
            "statusCode": 500,

            "body": json.dumps({"message": f"An error occurred: {str(e)}"}),
        }


def get_secret_hash(username, client_id, client_secret):
    msg = username + client_id
    dig = hmac.new(
        str(client_secret).encode("utf-8"),
        msg=str(msg).encode("utf-8"),
        digestmod=hashlib.sha256,
    ).digest()
    return base64.b64encode(dig).decode()
