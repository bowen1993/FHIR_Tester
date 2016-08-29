import os
from datetime import datetime
from django.db import transaction
import hashlib
import random
import string
from home import Runner
from home.models import task, result, task_steps


def random_string_generate(length):
    '''
    random string generator

    @param length: length of the string to be generated, required
    @type length: int
    @return random string
    @rtype str
    '''
    return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(length))

def form_taskname(salt):
    salt += random_string_generate(3)
    timestamp = datetime.now().isoformat()
    return hashlib.sha1(timestamp+salt).hexdigest()[:10]

class test_task:
    def __init__(self, language="", code="", test_type=0):
        self.test_type = test_type
        self.language = language
        self.code = code
        self.task_name = form_taskname(language)
        self.result = ''
        self.status='created'
        self.is_finished = False
        #create database object
        with transaction.atomic():
            new_task = task(task_id=self.task_name,language=self.language,task_type=self.test_type, status=self.status,code=self.code)
            try:
                new_task.save()
            except:
                self.form_error_report("Database object creation failed, process killed")
                self.save_result()
    def isProcessable(self):
        return self.test_type == 1
    def run(self):
        if self.test_type == 0:
            #run standard test
            #create basic resources
            #create random cases and send 
            #generate results
            pass
        else:
            if self.is_finished:
                return
            #write code to file
            code_filename = self.write_code2file()
            #print code_filename
            if not code_filename:
                #print "no code file"
                self.form_error_report("Can't run code. Wrong code type or server error")
                self.save_result()
                return
            #run code with runner.excute
            output_filename = self.task_name + '_out'
            #print output_filename
            command = self.get_command()
            #print command
            if not command:
                #print 'No command'
                self.form_error_report("Can't excute code")
                self.save_result()
                return
            res = Runner.excute(code_filename, output_filename, command, 1000, 100)
            #print res

            #analyse output file
            #remove output file
            #save result to database
    def get_code_filename(self):
        filename = self.task_name
        if self.language == 'python':
            filename += '.py'
            return filename
        elif self.language == 'monkey':
            filename += '.monkey'
            return filename
        else:
            return None
    def write_code2file(self):
        filename = self.get_code_filename()
        if filename:
            code_file = open(filename, 'w')
            code_file.write(self.code)
            code_file.close()
            return filename
        else:
            return None
    def get_command(self):
        command = ''
        if self.language == 'python':
            command += 'python'
        elif self.language == 'monkey':
            command += 'monkey.py'
        return command
    def form_error_report(self, error_msg):
        self.result = error_msg
        self.status="Program Error"
    def save_result(self):
        task_obj = None
        with transaction.atomic():
            try:
                task_obj = task.objects.get(task_id=self.task_name)
                new_result_obj = result(task=task_obj,status=self.status)
                new_result_obj.save()
            except:
                pass
    def get_id(self):
        return self.task_name