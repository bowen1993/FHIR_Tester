import os
import datetime
import hashlib
import random
import string

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
    def __init__(self, language="", code="", test_type):
        self.test_type = test_type
        self.language = language
        self.code = code
        self.task_name = form_taskname(language)
    def isProcessable(self):
        return self.test_type == 1
    def run(self):
        pass
    def get_result(self):
        pass