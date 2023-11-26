import boto3
import json

def get_value_or_null(dictionary, key):
    return dictionary.get(key, None)

def lambda_handler(event, context):
    try:
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table("tasks_DB")

        required_fields = ['projectID', 'taskName', 'creatorUserID', 'taskID']

        task_info = json.loads(event['body'])

        for field in required_fields:
            if field not in task_info:
                return {
                    'statusCode': 400,
                    'body': f'Missing required field: {field}'
                }

        task_id = task_info['taskID']
        project_id = task_info['projectID']

        update_expression_keys = ['taskName', 'creatorUserID', 'tasksDescription', 'taskDueDate', 'taskTags', 'assigneeUserID', 'priority', 'storyPoints']

        update_expression = [f"{key} = :{key}" for key in update_expression_keys]

        expression_attribute_values = {f":{key}": task_info[key] for key in update_expression_keys}

        response = table.update_item(
            Key={
                'taskID': task_id,
                'projectID': project_id
            },
            UpdateExpression='SET ' + ', '.join(update_expression),
            ExpressionAttributeValues=expression_attribute_values
        )

        return {
            'statusCode': 200,
            'body': 'Item updated in the table',
            'response': response
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': 'An error occurred: ' + str(e)
        }

