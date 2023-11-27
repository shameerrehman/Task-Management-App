import json
import boto3
from boto3.dynamodb.conditions import Key
from botocore.exceptions import ClientError
from decimal import Decimal


dynamodb = boto3.resource('dynamodb')


def custom_serializer(obj):
    """Custom JSON serializer for sets and Decimal types."""
    if isinstance(obj, Decimal):
        return int(obj)
    elif isinstance(obj, set):
        # Convert set to list for JSON serialization
        return list(obj)
    raise TypeError


def get_project_tasks(project_id):
    tasks_table = dynamodb.Table('tasks_DB')

    try:
        response = tasks_table.query(
            IndexName='ProjectIDIndex',
            KeyConditionExpression="projectID = :project_id",
            ExpressionAttributeValues={
                ":project_id": project_id
            }
        )
        print(f"DynamoDB Response: {response}")

        if 'Items' in response:
            items = response['Items']
            print("GetItem succeeded:")
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'data': items
                }, default=custom_serializer)  # Use the custom serialization function here
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


def lambda_handler(event, context):
    user_id = event.get('body')["userID"]

    print(f"Retrieving projects for userID: {user_id}")
    # user_projects = get_projects(user_id)
    print("Retrieving tasks for projects")
    projects_tasks = get_project_tasks(user_projects)

    user_projects_data = json.loads(user_projects["body"])["data"]
    project_tasks_data = json.loads(projects_tasks["body"])["data"]

