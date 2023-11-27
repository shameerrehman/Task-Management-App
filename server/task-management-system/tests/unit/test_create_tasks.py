import json
import boto3
import pytest
from moto import mock_dynamodb

from task_management import create_tasks


@pytest.fixture()
def apigw_event():
    """ Generates API GW Event"""
    item = {
          "projectID": "A808",
          "creatorUserID": "2002",
          "taskName": "task x",
          "taskDescription": "description",
          "taskDueDate": "2023-10-25",
          "taskTags": {"Tag1": "Value123"}
    }
    return {
        "body": json.dumps(item),
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


@pytest.fixture()
def tasks_db_table():
    with mock_dynamodb():
        dynamo = boto3.client('dynamodb', region_name='us-east-1')

        dynamo.create_table(
            TableName='tasks_DB',
            KeySchema=[{'AttributeName': 'taskID', 'KeyType': 'HASH'},
                       {'AttributeName': 'projectID', 'KeyType': 'RANGE'}],
            AttributeDefinitions=[{'AttributeName': 'taskID', 'AttributeType': 'S'},
                                  {'AttributeName': 'projectID', 'AttributeType': 'S'}],
            ProvisionedThroughput={'ReadCapacityUnits': 5, 'WriteCapacityUnits': 5},
            GlobalSecondaryIndexes=[
                {
                    'IndexName': 'ProjectIDIndex',
                    'KeySchema': [
                        {'AttributeName': 'projectID', 'KeyType': 'HASH'},
                        {'AttributeName': 'taskID', 'KeyType': 'RANGE'}
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
        yield dynamo


def test_create_tasks(apigw_event, tasks_db_table):

    ret = create_tasks.lambda_handler(apigw_event, "")
    print(ret)
    body = ret["body"]
    print(body)

    assert ret["statusCode"] == 200
