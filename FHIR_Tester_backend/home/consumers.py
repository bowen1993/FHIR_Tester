import json
from channels.sessions import channel_session
from channels import Group
from home.models import result, task, task_steps
from django.db import transaction
from time import sleep
import traceback


def form_results(task_id):
    res_dict = {
        'steps':[]
    }
    task_step_list = task_steps.objects.filter(task_id=task_id)
    for step in task_step_list:
        step_info = {
            'desc':step.step_desc,
            'addi':step.additional_info
        }
        res_dict['steps'].append(step_info)
    return res_dict


@channel_session
def ws_connect(message):
    try:
        prefix, task_id = message['path'].decode('ascii').strip('/').split('/')
        task.objects.get(task_id=task_id)
    except:
        return
    if prefix != 'task':
        return
    Group('task-%s'%task_id, channel_layer=message.channel_layer).add(message.reply_channel)
    

@channel_session
def ws_receive(message):
    print message.content['text']
    data = json.loads(message.content['text'])
    task_id = data['task_id']
    place = data['place']
    print task_id
    try:
        while True:
            with transaction.atomic():
                task_obj = task.objects.get(task_id=task_id)
                try:
                    result_obj = result.objects.get(task=task_obj)
                    print 'sending'
                    #return result and break
                    step_result = form_results(task_id)
                    step_result['test_type'] = task_obj.task_type
                    step_result['level'] = result_obj.level
                    res_data = {
                        'step_result':step_result,
                        'place':place
                    }
                    Group('task-%s'%task_id, channel_layer=message.channel_layer).send({'text':json.dumps(res_data)});
                    break
                except result.DoesNotExist:
                    print 'waiting'
                    #stop 0.2 seconds to wait for task runner
                    sleep(0.2)
    except:
        traceback.print_exc()
        res = {
            'isSuccessful':False,
            'msg': 'Error, task missing'
        }
        Group('task-%s'%task_id, channel_layer=message.channel_layer).send({'text':json.dumps(res)});
    #wait for process to be finished
    

@channel_session
def ws_disconnect(message):
    try:
        task_id = message.channel_session['task']
        task_obj = task.objects.get(task_id=task_id)
        Group('task-'+task_id, channel_layer=message.channel_layer).discard(message.reply_channel)
    except (KeyError, task.DoesNotExist):
        pass


