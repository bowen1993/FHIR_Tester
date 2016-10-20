from services.monkey import MonkeyInterpreter, MonkeyParser
import os
import time
import datetime
import sys
import StringIO
from home.models import task, task_steps
from django.db import transaction

BASE = os.path.dirname(os.path.abspath(__file__))

def createFolder(contentType):
    """
    create the folders with time steamp

    @param contentType: file type in the folder
    @type contentType: str
    @return: created path
    @rtype: str
    """
    basePath = BASE+'/../downloads/'
    year     = str(time.localtime().tm_year)
    month    = str(time.localtime().tm_mon)
    day      = str(time.localtime().tm_mday)
    if not os.path.exists(basePath + year + '/'):
        os.makedirs(basePath + year + '/')
    basePath += year + '/'
    if not os.path.exists(basePath + month + '/'):
        os.makedirs(basePath + month + '/')
    basePath += month + '/'
    if not os.path.exists(basePath + day + '/'):
        os.makedirs(basePath + day + '/')
    basePath += day + '/'
    if not os.path.exists(basePath + contentType + '/'):
        os.makedirs(basePath + contentType + '/')
    basePath += contentType + '/'
    return basePath

def geneFileName(name, surfix):
    """
    generate file name with time and given name

    @param name: name for the file
    @type name: str
    @param surfix: file extension
    @type surfix:str
    @return : filename
    @rtype: str
    """
    now = datetime.datetime.now()
    name = name.replace(' ', '')
    fileNameFormat = '%(year)i-%(month)i-%(day)i-%(hour)i-%(minute)i-%(second)i-%(name)s.%(extension)s'
    fileNameValue = {
                     'year' : now.year,
                     'month' : now.month,
                     'day' : now.day,
                     'hour' : now.hour,
                     'minute' : now.minute,
                     'second' : now.second,
                     'name' : name,
                     'extension' : surfix
                     }
    return fileNameFormat % fileNameValue

def do_monkey_test(monkey_code, task_id):
    prog = MonkeyParser.parse(monkey_code, 0)
    basepath = createFolder('img')
    if basepath.endswith('/'):
        basepath = basepath[:-1]
    code_filename = geneFileName('monkey', 'py')
    mintp = MonkeyInterpreter.MonkeyInterpreter(prog, code_filename,task_id,  basepath)
    mintp.translate()
    py_code = mintp.get_code_content()
    print py_code
    codeOut = StringIO.StringIO()
    codeErr = StringIO.StringIO()
    sys.stdout = codeOut
    sys.stderr = codeErr
    exec py_code
    sys.stdout = sys.__stdout__
    sys.stderr = sys.__stderr__
    print 'executation done'
    s = codeErr.getvalue()
    print "error:\n%s\n" % s
    s = codeOut.getvalue()
    print "output:\n%s" % s
    codeOut.close()
    codeErr.close()
    save_test_steps(basepath, task_id, steps)

def save_test_steps(basepath, task_id, steps):
    try:
        t_obj = task.objects.get(task_id=task_id)
    except:
        return
    for step_info in steps:
        with transaction.atomic():
            new_step = task_steps(task_id=task_id,name=step_info[0], additional_file=step_info[1].replace(BASE+'/../downloads/', '/static/'),step_desc='%s success' % step_info[0])
            try:
                new_step.save()
            except:
                pass
        print '%s,%s' % (step_info[0], step_info[1])



