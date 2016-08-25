from celery import task
from home.test_task import test_task
from home.models import task, result, task_steps
@task()
def run_test_task(language, code, url, test_type):
    pass
