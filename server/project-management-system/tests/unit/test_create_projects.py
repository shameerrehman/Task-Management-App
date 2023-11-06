import pytest
import boto3
from moto import mock_dynamodb
from project_management import create_projects
from datetime import date


@pytest.fixture()
def apigw_event():
    item = {
        "userID": "testID",
        "projectName": "Test Project",
        "projectLead": "lead user",
        "description": "This is a test project's description",
        "teamMembers": ["Shameer", "Joseph", "Saiharan", "Ashreet", "Atheesh"],
        "startTime": date.today().isoformat(),
        "endTime": "2025-05-15"
    }
    return {
        "body": item,
        "resource": "/{proxy+}",
        "requestContext": {
            "resourceId": "123456",
            "apiId": "1234567890",
            "resourcePath": "/{proxy+}",
            "httpMethod": "POST",
            "requestId": "c6af9ac6-7b61-11e6-9a41-93e8deadbeef",
            "accountId": "123456789012",
            "identity": {
                "apiKey": "",
                "userArn": "",
                "cognitoAuthenticationType": "",
                "caller": "",
                "userAgent": "Custom User Agent String",
                "user": "",
                "cognitoIdentityPoolId": "",
                "cognitoIdentityId": "",
                "cognitoAuthenticationProvider": "",
                "sourceIp": "127.0.0.1",
                "accountId": "",
            },
            "stage": "prod",
        },
        "queryStringParameters": {"foo": "bar"},
        "headers": {
            "Via": "1.1 08f323deadbeefa7af34d5feb414ce27.cloudfront.net (CloudFront)",
            "Accept-Language": "en-US,en;q=0.8",
            "CloudFront-Is-Desktop-Viewer": "true",
            "CloudFront-Is-SmartTV-Viewer": "false",
            "CloudFront-Is-Mobile-Viewer": "false",
            "X-Forwarded-For": "127.0.0.1, 127.0.0.2",
            "CloudFront-Viewer-Country": "US",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Upgrade-Insecure-Requests": "1",
            "X-Forwarded-Port": "443",
            "Host": "1234567890.execute-api.us-east-1.amazonaws.com",
            "X-Forwarded-Proto": "https",
            "X-Amz-Cf-Id": "aaaaaaaaaae3VYQb9jd-nvCd-de396Uhbp027Y2JvkCPNLmGJHqlaA==",
            "CloudFront-Is-Tablet-Viewer": "false",
            "Cache-Control": "max-age=0",
            "User-Agent": "Custom User Agent String",
            "CloudFront-Forwarded-Proto": "https",
            "Accept-Encoding": "gzip, deflate, sdch",
        },
        "pathParameters": {"proxy": "/examplepath"},
        "httpMethod": "POST",
        "stageVariables": {"baz": "qux"},
        "path": "/examplepath",
    }


@pytest.fixture
def dynamodb_table():
    with mock_dynamodb():
        dynamo = boto3.client('dynamodb', region_name='us-east-1')

        dynamo.create_table(
            TableName='projects_DB',
            KeySchema=[{'AttributeName': 'projectID', 'KeyType': 'HASH'},
                       {'AttributeName': 'userID', 'KeyType': 'RANGE'}],
            AttributeDefinitions=[{'AttributeName': 'projectID', 'AttributeType': 'S'},
                                  {'AttributeName': 'userID', 'AttributeType': 'S'}],
            ProvisionedThroughput={'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5},
            GlobalSecondaryIndexes=[
                {
                    'IndexName': 'UserIDIndex',
                    'KeySchema': [
                        {'AttributeName': 'userID', 'KeyType': 'HASH'},
                        {'AttributeName': 'projectID', 'KeyType': 'RANGE'}
                    ],
                    'Projection': {
                        'ProjectionType': 'ALL'
                    },
                    'ProvisionedThroughput': {
                        'ReadCapacityUnits': 5,
                        'WriteCapacityUnits': 5
                    }
                }
            ]
        )
        dynamo.put_item(
            TableName='projects_DB',
            Item={
                'projectID': {'S': 'testProjectID'},
                'userID': {'S': 'testID'},
                'projectName': {'S': 'testProject'},
                'projectDescription': {'S': 'A mocked project for testing'},
                'sections': {'SS': ['to-do', 'in-progress', 'done']},
                'defaultView': {'S': 'Board'}
            }
        )

        yield dynamo


def test_create_projects(apigw_event, dynamodb_table):
    ret = create_projects.lambda_handler(apigw_event, context="")
    print(ret.get("response"))
    assert ret["statusCode"] == 200

