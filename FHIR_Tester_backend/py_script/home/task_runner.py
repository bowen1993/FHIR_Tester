from home.tasks import run_test_task
from home.test_task import test_task

def perform_test(language, code, url, test_type,server_id=None, resource_list=[], access_token=None, username=None):
    new_test_task = test_task(resources=resource_list,language=language,code=code,test_type=test_type,url=url,server_id=server_id,access_token=access_token, username=username)
    run_test_task.delay(new_test_task)
    return new_test_task.get_id()