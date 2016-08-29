from celery import task
from home.test_task import test_task
@task()
def run_test_task(task_obj):
    task_obj.run()
