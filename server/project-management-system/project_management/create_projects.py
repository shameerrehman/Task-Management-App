import boto3
import uuid
import json


def create_uuid_util():
    return str(uuid.uuid4())


def lambda_handler(event, context):
    try:
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table("projects_DB")

        project_information = json.loads(event['body'])
        required_fields = ["userID", "projectName", "description"]

        for field in required_fields:
            if not project_information[field]:
                return {
                    'statusCode': 400,
                    'body': f'Missing required field: {field}'
                }

        project_key = generate_project_key(project_information['projectName'])

        item = {
            'projectID': create_uuid_util(),
            'userID': project_information['userID'], 
            'projectName': project_information['projectName'],
            'projectLead': project_information['projectLead'],
            'description': project_information['description'],
            'teamMembers': project_information['teamMembers'],
            'startTime': project_information['startTime'],
            'endTime': project_information['endTime'],
            'projectKey': project_key,
            'taskSequence': 1,
        }
        print(item)
        response = table.put_item(Item=item)

        return {
            'statusCode': 200,
            'body':'Item added to table',
            'response': response
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': 'An error occurred: ' + str(e) + ' data was' + str(project_information)
        }


def generate_project_key(project_name):
    if len(project_name.split()) > 1:
        return acronymize(project_name)
    else:
        return disemvowel(project_name)


def disemvowel(project_name):
    vowels = 'aeiouAEIOU'
    return ''.join([letter for letter in project_name if letter not in vowels]).upper()


def acronymize(project_name):
    words = project_name.split()
    if len(words) == 1:
        return words[0][:4].upper()
    else:
        return ''.join(word[0] for word in words).upper()
