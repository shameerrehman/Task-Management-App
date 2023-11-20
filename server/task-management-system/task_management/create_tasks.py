import boto3
import uuid
import json

from botocore.exceptions import ClientError
from decimal import Decimal


def get_value_or_null(dictionary, key):
    return dictionary.get(key, None)


def custom_serializer(obj):
    """Custom JSON serializer for sets and Decimal types."""
    if isinstance(obj, Decimal):
        return int(obj)
    elif isinstance(obj, set):
        # Convert set to list for JSON serialization
        return list(obj)
    raise TypeError


def lambda_handler(event, context):
    try:
        dynamodb = boto3.resource('dynamodb')
        tasks_table = dynamodb.Table("tasks_DB")

        required_fields = ['projectID', 'taskName', 'creatorUserID']

        task_info = json.loads(event['body'])

        for field in required_fields:
            if field not in task_info:
                return {
                    'statusCode': 400,
                    'body': f'Missing required field: {field}'
                }

        task_id = str(uuid.uuid4())

        item = {
            'taskID': task_id,
            'projectID': task_info['projectID'],
            'taskName': task_info['taskName'],
            'taskDescription': get_value_or_null(task_info, 'tasksDescription'),
            'taskDueDate': get_value_or_null(task_info, 'taskDueDate'),
            'status': 'TODO',
            'taskTags': get_value_or_null(task_info, 'taskTags'),
            'creatorUserID': task_info['creatorUserID'],
            'assigneeUserID': get_value_or_null(task_info, 'assigneeUserID'),
            'priority': get_value_or_null(task_info, 'priority'),
            'storyPoints': get_value_or_null(task_info, 'storyPoints'),
            'taskKey': get_task_key(task_info['projectID'])
        }

        response = tasks_table.put_item(Item=item)

        return {
            'statusCode': 200,
            'body': 'Item added to table',
            'response': response
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': 'An error occurred: ' + str(e)
        }


def get_task_key(project_id):
    dynamodb = boto3.resource('dynamodb')
    projects_table = dynamodb.Table('projects_DB')

    try:
        response = projects_table.query(
            KeyConditionExpression="projectID = :project_id",
            ExpressionAttributeValues={
                ":project_id": project_id
            }
        )
        print(f"DynamoDB Response: {response}")

        if 'Items' in response:
            items = response['Items']
            print("GetItem succeeded")

            # Extracting projectKey and taskSequence
            project_key = items[0]['projectKey']
            task_sequence = items[0]['taskSequence']

            # Increment taskSequence
            new_task_sequence = task_sequence + 1

            # Update the item in DynamoDB
            update_response = projects_table.update_item(
                Key={'projectID': project_id, 'userID': items[0]['userID']},
                UpdateExpression="SET taskSequence = :new_val",
                ExpressionAttributeValues={
                    ":new_val": new_task_sequence
                },
                ReturnValues="UPDATED_NEW"
            )
            print(f"Update Response: {update_response}")

            return f"{project_key}-{new_task_sequence}"
        else:
            print("No item found with the provided key.")
            return None
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
