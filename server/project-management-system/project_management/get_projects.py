import boto3
import json
from botocore.exceptions import ClientError
from decimal import Decimal


def custom_serializer(obj):
    """Custom JSON serializer for sets and Decimal types."""
    if isinstance(obj, Decimal):
        return int(obj)
    elif isinstance(obj, set):
        # Convert set to list for JSON serialization
        return list(obj)
    raise TypeError


def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    projects_table = dynamodb.Table('projects_DB')
    user_id = event.get('queryStringParameters')['userID']

    try:
        response = projects_table.query(
            IndexName='UserIDIndex',
            KeyConditionExpression="userID = :user_id",
            ExpressionAttributeValues={
                ":user_id": user_id
            }
        )
        print(f"DynamoDB Response: {response}")

        if 'Items' in response:
            items = response['Items']
            print("GetItem succeeded")
            return {
                'statusCode': 200,
                'body': json.dumps({'data': items}, default=custom_serializer)
            }
        else:
            print("No item found with the provided key.")
            return {
                'statusCode': 404,
                'body': json.dumps('Item not found')
            }
    except ClientError as e:
        print(f"ClientError: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps('Error in getting item')
        }
    except Exception as e:
        print(f"Unknown error: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps('An unknown error occurred')
        }
