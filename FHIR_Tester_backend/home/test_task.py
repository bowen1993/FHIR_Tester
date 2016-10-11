import os
from datetime import datetime
from django.db import transaction
import hashlib
import random
import string
from home import Runner
from home.models import task, result, task_steps
from services.create_resource import *
from services.genomic_standard_test import *
from services.fhir_step_test import *


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
    def __init__(self, resources = [], language="", code="", test_type=0, url="",server_id=None, access_token=None, username=None):
        self.test_type = test_type
        self.language = language
        self.username = username
        self.resources = resources
        self.code = code
        self.url = url
        self.server_id=server_id
        self.task_name = form_taskname(language)
        self.result = ''
        self.access_token = access_token
        self.status='created'
        self.level = None
        self.baseid_dict = {}
        self.is_finished = False
        #create database object
        with transaction.atomic():
            new_task = task(task_id=self.task_name,language=self.language,task_type=self.test_type, status=self.status,code=self.code, user_id=self.username, target_server_id=server_id)
            try:
                new_task.save()
            except:
                self.form_error_report("Database object creation failed, process killed")
                self.save_result()
    def isProcessable(self):
        return self.test_type == 1
    def run(self):
        print 'running'
        print self.url
        if self.test_type == 0:
            #run standard test
            level, id_dict = do_standard_test(self.task_name ,self.url, self.access_token)
            self.baseid_dict = id_dict
            print level
            self.level = level
            #save result
            self.status = 'finished'
            self.save_result()
        elif self.test_type == 3:
            id_dict = test_resources(self.resources, self.task_name, self.url, self.access_token)
            self.baseid_dict = id_dict
            self.status = 'finished'
            self.save_result()
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
            self.save_steps(output_filename)
            #remove code & output file
            print code_filename
            print output_filename
            os.remove(code_filename)
            os.remove(output_filename)
            #save result to database
            self.result = res.split(',')[0]
            self.status='finished'
            self.is_finished = True
            try:
                with transaction.atomic():
                    task_obj = task.objects.get(task_id=self.task_name)
                    task_obj.status = self.status
                    new_result = result(task=task_obj,status=self.result)
                    new_result.save()
                    task_obj.save()
            except:
                print 'Save result error, task: %s' % self.task_name
        print 'finished'
    def save_steps(self, output_filename):
        output = open(output_filename, 'r')
        for line in output.xreadlines():
            trimline = line[:-1]
            infos = trimline.split(':')
            while len(infos) < 3:
                infos.append('')
            with transaction.atomic():
                try:
                    new_task_step = task_steps(task_id=self.task_name,step_desc='%s %s' % (infos[1], infos[2]), name=infos[0])
                    new_task_step.save()
                except:
                    print 'Save step error, task: %s' % self.task_name

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
        print 'Saving result'
        with transaction.atomic():
            try:
                task_obj = task.objects.get(task_id=self.task_name)
                new_result_obj = result(task=task_obj,status=self.status, level=self.level)
                new_result_obj.save()
                task_obj.status = 'finished'
                task_obj.save()
            except:
                pass
        print 'saved'
    def get_id(self):
        return self.task_name