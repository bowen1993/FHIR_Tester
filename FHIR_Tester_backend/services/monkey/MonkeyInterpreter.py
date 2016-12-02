from CodeGenerator import *
class MonkeyInterpreter:
    def __init__(self, prog, filename="", identify="", base_path=""):
        self.prog = prog
        self.func_table = {}
        self.code_str = ''
        self.filename = filename
        self.url = ''
        self.driver = ''
        self.indent = 0
        self._code_init()
        self.base_path = base_path
        self.id = identify
    
    def _code_init(self):
        self.code_str = """from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
import time
user_agent = (
   "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Safari/602.1.50'"
)
steps = []
dcap = dict(DesiredCapabilities.PHANTOMJS)
dcap["phantomjs.page.settings.userAgent"] = user_agent
"""

    def save(self):
        if len(self.filename) > 0:
            code_file = open(self.filename, 'w')
            code_file.write(self.code_str)
            code_file.close()
            return (True, 'Success')
        else:
            return (False, 'No filename or empty filename')
    
    def curr_indent(self):
        return '    '*self.indent

    def add_screenshot(self, filename, hint):
        step_info_dict = {
            'basepath': self.base_path,
            'filename':filename,
            'id':self.id,
            'hint':hint
        }
        self.code_str += "driver.get_screenshot_as_file('%(basepath)s/%(id)s_%(filename)s')\nsteps.append(('%(hint)s','%(basepath)s/%(id)s_%(filename)s'))\n" % step_info_dict

    def translate(self):
        for index, action in enumerate(self.prog):
            print action
            if action['type'] == 'auth':
                self.code_str += self.transAuth(action)
            elif 'single' in action['type']:
                self.code_str += self.transSingleAction(action)
            elif 'target' in action['type']:
                self.code_str += self.transTargetAction(action)
            elif 'command' in action['type']:
                self.code_str += self.transCommandAction(action)
            elif 'judge' in action['type']:
                self.code_str += self.transJudgeAction(action)
            elif 'repeat' in action['type']:
                self.code_str += self.transRepeat(action)
            elif 'task' in action['type']:
                self.code_str += self.transTask(action)
            if "driver.get(" in self.code_str:
                self.add_screenshot("%d.png"%index, action['move'])
        self.code_str += "driver.close()"
    
    def transAuth(self, action):
        username = action['username']
        password = action['password']
        return "driver.switch_to.alert.authenticate('%s','%s')" % (username, password)
    
    def transSingleAction(self, action):
        move = action['move']
        is_success, stmt_str = globals()[move]()
        if is_success:
            return stmt_str
    
    def transTargetAction(self, action):
        move = action['move']
        args = {
            'target':action['target']
        }
        if 'value' in action:
            args['value'] = action['value']
        is_success, stmt_str = globals()[move](**args)
        if is_success:
            return stmt_str
    
    def transCommandAction(self, action):
        move = action['move']
        args = {
            'value':action['value']
        }
        is_success, stmt_str = globals()[move](**args)
        if is_success:
            return stmt_str
    
    def transJudgeAction(self, action):
        args = {
            'target':action['target'],
            'value':action['expect'],
            'is_equal' : action['is_equal']
        }
        is_success, stmt_str = Judge(**args)
        if is_success:
            return stmt_str
    
    def transRepeat(self, action):
        return ""
    
    def transTask(self, action):
        return ""
    def get_code_content(self):
        return self.code_str