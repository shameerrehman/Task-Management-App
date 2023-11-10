import boto3
import uuid
import json


def get_value_or_null(dictionary, key):
    return dictionary.get(key, None)


def lambda_handler(event, context):
    try:
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table("tasks_DB")

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
            'storyPoints': get_value_or_null(task_info, 'storyPoints')
        }

        response = table.put_item(Item=item)

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
