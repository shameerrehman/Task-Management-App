import boto3
import json

def lambda_handler(event, context):
    try:
        dynamodb = boto3.resource('dynamodb')
        tasks_table = dynamodb.Table("tasks_DB")


        body = json.loads(event['body'])
        task_id = body.get('taskID')
        project_id = body.get('projectID')

        if not task_id or not project_id:
            return {
                'statusCode': 400,
                'body': 'Both taskID and projectID are required for deletion'
            }

        response = tasks_table.get_item(Key={'taskID': task_id, 'projectID': project_id})
        existing_task = response.get('Item')

        if not existing_task:
            return {
                'statusCode': 404,
                'body': 'Task not found'
            }

        tasks_table.delete_item(Key={'taskID': task_id, 'projectID': project_id})

        return {
            'statusCode': 200,
            'body': 'Item deleted successfully'
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': 'An error occurred: ' + str(e)
        }
