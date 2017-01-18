from django.db import models
from account.models import User

# Create your models here.

class server(models.Model):
    server_id = models.AutoField(primary_key=True)
    server_name = models.CharField(max_length=256)
    server_url = models.URLField(max_length=256)
    access_token = models.TextField(null=True)
    is_delete = models.BooleanField(default=False)
    is_deletable = models.BooleanField(default=True)

class resource(models.Model):
    name = models.CharField(max_length=128)
    resource_type = models.IntegerField(default=0)

class task(models.Model):
    task_id = models.CharField(max_length=10, primary_key=True)
    target_server = models.ForeignKey(server, null=True)
    language = models.CharField(max_length=16)
    task_type = models.CharField(max_length=16)
    status = models.CharField(max_length=16)
    code = models.TextField(null=True)
    create_time = models.DateTimeField(auto_now_add=True)
    user=models.ForeignKey(User, null=True)


class result(models.Model):
    task = models.ForeignKey(task)
    status = models.CharField(max_length=32, null=True)
    level = models.CharField(max_length=64, null=True)

class task_steps(models.Model):
    task = models.ForeignKey(task)
    step_desc = models.TextField(null=True)
    additional_file = models.CharField(max_length=256, null=True)
    name = models.CharField(max_length=64, null=True)

class step_detail(models.Model):
    step = models.ForeignKey(task_steps)
    resource_name = models.CharField(max_length=64, null=True)
    detail_desc = models.TextField(null=True)
    detail_status = models.IntegerField(default=0)
    http_request = models.TextField(null=True)
    request_resource = models.TextField(null=True)
    http_response = models.TextField(null=True)
    response_message = models.TextField(null=True)

