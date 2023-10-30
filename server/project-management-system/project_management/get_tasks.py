import boto3


def lambda_handler(event, context):
    user_id = event.get('body')["userID"]

    print(f"Retrieving projects for userID: {user_id}")
    user_projects = get_projects(user_id)
    print("Retrieving tasks for projects")
    projects_tasks = get_project_tasks(user_projects)

    user_projects_data = json.loads(user_projects["body"])["data"]
    project_tasks_data = json.loads(projects_tasks["body"])["data"]