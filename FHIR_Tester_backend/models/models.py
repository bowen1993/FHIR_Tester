from mongoengine import *
import datatime
from config.config import status_code

class User(Document):
    username = StringField(unique=True, required=True)
    password = StringField(required=True)
    user_level = IntFiled(required=True, default=0)

class FHIRServer(Document):
    name = StringField(required=True, max_length=256)
    url = URLField(required=True)
    access_token = StringField(required=False)

class Resource(Document):
    name = StringField(required=True, max_length=256)

class Level(Document):
    name = StringField(required=True)

class Case(Document):
    code_status = StringField(required=True, max_length=64, choices=status_code.keys())
    name = StringField(required=True)
    description = StringField()
    http_request = StringField()
    http_response = StringField()
    http_response_status = IntFiled()
    resource = StringField()
    @property
    def status(self):
        return status_code[self.code_status]

class Step(Document):
    name = StringField(required=True)
    code_status = StringField(required=True, max_length=64, choices=status_code.keys())
    description = StringField()
    additional_filepath = StringField()
    cases = ListField(ReferenceField(Case))
    @property
    def status(self):
        return status_code[self.code_status]

class Task(Document):
    target_server = ReferenceField(Server, required=False)
    language = StringField(required=False, max_length=16)
    task_type = StringField(required=True)
    code_status = StringField(required=True, max_length=64, choices=status_code.keys())
    code = StringField(required=False)
    create_time = DateTimeField(default=datetime.datetime.now)
    user = ReferenceField(User, required=False)
    steps = ListField(ReferenceField(Step))
    @property
    def status(self):
        return status_code[self.code_status]

class Result(Document):
    task = ReferenceField(Task, required=True)
    code_status = StringField(required=True, max_length=64, choices=status_code.keys())
    level = ListField(ReferenceField(Level))
    @property
    def status(self):
        return status_code[self.code_status]