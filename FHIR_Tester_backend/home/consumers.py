import json
from channels.sessions import channel_session
from channels import Group
from home.models import result, task, task_steps, step_detail
from django.db import transaction
from time import sleep
import traceback


def form_results(task_id):
    res_dict = {
        'steps':[]
    }
    task_step_list = task_steps.objects.filter(task_id=task_id)
    sindex = 0
    for step in task_step_list:
        dindex = 0
        step_info = {
            'desc':step.step_desc,
            'addi':step.additional_file,
            'details':[],
            'index':sindex,
            'name':step.name
        }
        details = step_detail.objects.filter(step=step)
        for detail in details:
            new_detail = {
                'index':dindex,
                'desc':detail.detail_desc,
                'status':detail.detail_status,
                'req_header':detail.http_request,
                'req_resource':detail.request_resource,
                'res_header':detail.http_response,
                'response_message':detail.response_message,
                'resource_name':detail.resource_name
            }
            step_info['details'].append(new_detail)
            dindex += 1

        res_dict['steps'].append(step_info)
        sindex += 1
    return res_dict

def form_detil_report(step_obj):
    details = step_detail.objects.filter(step=step_obj)
    status_dict = {}
    res = []
    for detail in details:
        if detail.resource_name not in status_dict:
            status_dict[detail.resource_name] = detail.detail_status
        else:
            status_dict[detail.resource_name] = status_dict[detail.resource_name] and detail.detail_status
    for key in status_dict:
        res.append({'resource':key, 'status':status_dict[key]})
    return res
def form_test_report(task_id):
    res = {
        'infos':[]
    }
    try:
        task_obj = task.objects.get(task_id=task_id)
        res['server'] = task_obj.target_server.server_name
        steps = task_steps.objects.filter(task=task_obj)
        for step_obj in steps:
            info = {
                'name':step_obj.name,
                'detail_infos':form_detil_report(step_obj),
                'status': True if 'success' in step_obj.step_desc.lower() else False
            }
            res['infos'].append(info)
    except task.DoesNotExist:
        res['error'] = 'Invalid Task'
    return res


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
    max_waitting = 500
    while True:
        if max_waitting < 0:
            Group('task-%s'%task_id, channel_layer=message.channel_layer).send({'text':'Task exceed time limit'})
            break
        curr_steps = []
        try:
            task_obj = task.objects.get(task_id=task_id)
            #retrive current steps
            with transaction.atomic():
                step_result = form_results(task_id)
                if len(step_result['steps']) == 0 or set(curr_steps) == set(step_result):
                    sleep(0.3)
                else:
                    curr_steps = step_result
                    step_result['test_type'] = task_obj.task_type
                    step_result['level'] = -1
                    res_data = {
                        'step_result':step_result,
                        'place':place,
                        'isFinal':False
                    }
                    Group('task-%s'%task_id, channel_layer=message.channel_layer).send({'text':json.dumps(res_data)})
                    sleep(0.4)

            #check result
                result_obj = result.objects.get(task=task_obj)
                print 'sending'
                step_result = form_results(task_id)
                test_report = form_test_report(task_id)
                test_report['level'] = result_obj.level
                test_report['test_type'] = task_obj.task_type
                step_result['test_type'] = task_obj.task_type
                step_result['level'] = result_obj.level
                res_data = {
                    'step_result':step_result,
                    'place':place,
                    'test_report':test_report,
                    'isFinal':True
                }
                Group('task-%s'%task_id, channel_layer=message.channel_layer).send({'text':json.dumps(res_data)})
                break
        except task.DoesNotExist:
            Group('task-%s'%task_id, channel_layer=message.channel_layer).send({'text':'Wrong task id'});
            break
        except result.DoesNotExist:
            max_waitting -= 1
            continue
    

@channel_session
def ws_disconnect(message):
    try:
        task_id = message.channel_session['task']
        task_obj = task.objects.get(task_id=task_id)
        Group('task-'+task_id, channel_layer=message.channel_layer).discard(message.reply_channel)
    except (KeyError, task.DoesNotExist):
        pass


