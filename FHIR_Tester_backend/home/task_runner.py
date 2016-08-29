from home.tasks import run_test_task
from home.test_task import test_task

def perform_test(language, code, url, test_type):
    new_test_task = test_task(language=language,code=code,test_type=test_type)
    run_test_task.delay(new_test_task)
    return new_test_task.get_id()