import boto3
import uuid


def create_uuid_util():
    return str(uuid.uuid4())


def lambda_handler(event, context):
    try:
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table("projects_DB")

        project_information = event.get('body')

        required_fields = ["userID", "projectName", "description"]

        for field in required_fields:
            if not project_information[field]:
                return {
                    'statusCode': 400,
                    'body': f'Missing required field: {field}'
                }

        item = {
            'projectID': create_uuid_util(),
            'userID': project_information['userID'],
            'projectName': project_information['projectName'],
            'projectLead': project_information['projectLead'],
            'description': project_information['description'],
            'teamMembers': project_information['teamMembers'],
            'startTime': project_information['startTime'],
            'endTime': project_information['endTime'],
        }
        print(item)
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
