import boto3
import os
import hmac, hashlib, base64
import json
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    try:
        # Extract user credentials from the event (e.g., username and password)
        event_body = json.loads(event['body'])
        password = event_body['password']

        cognito_client = boto3.client('cognito-idp')
        
        # Cognito User Pool ID and App Client ID
        user_pool_id = os.environ['userpool_id']
        client_id = os.environ['client_id']
        CLIENT_SECRET = os.environ['CLIENT_SECRET']
        username = None
        if 'email' in event_body:
            email = event_body['email']
            response = cognito_client.list_users(
                UserPoolId=user_pool_id,
                Filter=f'email = "{email}"',
                Limit=1,
            )
            username = response['Users'][0]['Username']
        if ('username' in event_body) or (username != None):
            if 'username' in event_body:
                username = event_body['username']
            secret_hash = get_secret_hash(username, client_id, CLIENT_SECRET)
            # Sign in the user
            response = cognito_client.initiate_auth(
                ClientId=client_id,
                AuthFlow='USER_PASSWORD_AUTH',
                AuthParameters={
                    'USERNAME': username,
                    'PASSWORD': password,
                    "SECRET_HASH": secret_hash
                }
            )
            
            # Extract the authentication result from the response
            authentication_result = response['AuthenticationResult']

            return {
                'statusCode': 200,
                'body': json.dumps({
                    "message": "User signed in successfully",
                    'authenticationResult': authentication_result
                })
            }
    
    except KeyError as e:
        return {
            'statusCode': 400,
            'body': json.dumps({
                "message": f"Missing key in request: {e}"
            })
        }
    except ClientError as e:
        return {
            'statusCode': 500,
            'body': json.dumps({
                "message": f"Cognito error: {e.response['Error']['Message']} for user {username}"
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({
                "message": f"An unexpected error occurred: {str(e)}"
            })
        }
                
        
def get_secret_hash(username, client_id, client_secret):
    msg = username + client_id
    dig = hmac.new(str(client_secret).encode('utf-8'), 
                   msg=str(msg).encode('utf-8'), digestmod=hashlib.sha256).digest()
    return base64.b64encode(dig).decode()
