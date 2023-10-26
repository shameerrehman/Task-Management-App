import boto3
import os
import json
import hmac, hashlib, base64 # for hashing

cognito_client = boto3.client('cognito-idp')
CLIENT_ID = os.environ['CLIENT_ID']
CLIENT_SECRET = os.environ['CLIENT_SECRET']

def lambda_handler(event, context):
    event = json.loads(event['body'])
    username = event['username']
    task = event['task']
    secret_hash = get_secret_hash(username, CLIENT_ID, CLIENT_SECRET)

    try:
        if task == "initiate":
            response = cognito_client.forgot_password(
                ClientId=CLIENT_ID,
                SecretHash=secret_hash,
                Username=username
            )
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': 'Password reset code sent successfully!',
                })
            }
        elif task == "confirm":
            confirmation_code = event['confirmation_code']
            new_password = event['new_password']
            response = cognito_client.confirm_forgot_password(
                ClientId=CLIENT_ID,
                Username=username,
                SecretHash=secret_hash,
                ConfirmationCode=confirmation_code,
                Password=new_password
            )
            return {
                'statusCode':200,
                'body': json.dumps({
                    'message': 'Password reset successfully!',
                })
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
        
        
def get_secret_hash(username, client_id, client_secret):
    msg = username + client_id
    dig = hmac.new(str(client_secret).encode('utf-8'), 
                   msg=str(msg).encode('utf-8'), digestmod=hashlib.sha256).digest()
    return base64.b64encode(dig).decode()