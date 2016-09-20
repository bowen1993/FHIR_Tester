from django.db import models
from account.models import User

# Create your models here.

class task(models.Model):
    task_id = models.CharField(max_length=10, primary_key=True)
    language = models.CharField(max_length=16)
    task_type = models.CharField(max_length=16)
    status = models.CharField(max_length=16)
    code = models.TextField(null=True)
    create_time = models.DateTimeField(auto_now_add=True)
    user=models.ForeignKey(User, null=True)


class result(models.Model):
    task = models.ForeignKey(task)
    status = models.CharField(max_length=32, null=True)
    level = models.IntegerField(null=True)

class task_steps(models.Model):
    task = models.ForeignKey(task)
    step_desc = models.CharField(max_length=256, null=True)
    additional_info = models.CharField(max_length=256, null=True)
