from home.models import task, task_steps,resource,server
from home.config import test_type
from datetime import datetime
def find_resource(name,target):
    for i in range(len(target)):
        if target[i]['name'] == name:
            return i
    return -1

def get_resources(resource_type=0):
    resource_list = resource.objects.filter(resource_type=resource_type)
    resources = []
    for resource_obj in resource_list:
        resources.append({'name': '%s %s' % ('Level' if resource_type==1 else '', resource_obj.name)})
    return resources

def get_levels():
    return [{'name':'Level 0'}, {'name':'Level 1'}, {'name':'Level 2'}, {'name':'Level 3'}, {'name':'Level 4'}, ]

def form_matrix(ttype,ttime=None):
    datas = {
        'servers':[],
        'resources':[],
        'links':[]
    }
    if ttype == test_type['FHIR_TEST']:
        datas['resources'] = get_resources(0)
    elif ttype == test_type['STANDARD_TEST']:
        datas['resources'] = get_resources(1)
    else:
        return datas
    datetime_obj = None
    print datas['resources']
    if ttime and len(ttime) > 0:
        datetime_obj = datetime.strptime(ttime, '%Y-%m-%d %H:%M:%S')
    server_list = server.objects.all()
    server_index = 0
    for server_obj in server_list:
        datas['servers'].append({'name':server_obj.server_name})
        #get task id
        task_id = None
        if datetime_obj:
            task_list = task.objects.filter(task_type=ttype,status="finished",target_server=server_obj,create_time=datetime_obj).values_list('task_id',flat=True)
            if len(task_list) != 0:
                task_id =task_list[0]
            else:
                server_index += 1
                continue
        else:
            task_list = task.objects.filter(task_type=ttype,status="finished",target_server=server_obj).order_by('-create_time').values_list('task_id',flat=True)
            if len(task_list) != 0:
                task_id =task_list[0]
            else:
                server_index += 1
                continue
        if task_id:
            task_step_list = task_steps.objects.filter(task_id=task_id).exclude(name="Setup")
            for task_step_obj in task_step_list:
                if task_step_obj.name == None or len(task_step_obj.name) == 0:
                    continue
                source = server_index
                print task_step_obj.name
                target = find_resource(task_step_obj.name,datas['resources'])
                if target == -1:
                    continue
                datas['links'].append({
                    'source':source,
                    'target':target,
                    'value':1 if 'success' in task_step_obj.step_desc.lower() else 0
                })
        server_index += 1
    return datas


def form_resource_martix():
    datas = {
        'servers':[],
        'resources':[],
        'links':[]
    }
    #get resources
    resource_list = resource.objects.filter(resource_type=0)
    for resource_obj in resource_list:
        datas['resources'].append({'name':resource_obj.name})
    server_list = server.objects.all()
    server_index = 0
    for server_obj in server_list:
        datas['servers'].append({'name':server_obj.server_name})
        task_list = task.objects.filter(task_type=3,status="finished",target_server=server_obj).order_by('-create_time').values_list('task_id',flat=True)
        task_id = None
        if len(task_list) != 0:
            task_id = task_list[0]
        else:
            server_index += 1
            continue
        if task_id != None:
            task_step_list = task_steps.objects.filter(task_id=task_id).exclude(name="Setup")
            for task_step_obj in task_step_list:
                source = server_index
                target = find_resource(task_step_obj.name,datas['resources'])
                if target == -1:
                    continue
                datas['links'].append({
                    'source':source,
                    'target':target,
                    'value':1 if 'success' in task_step_obj.step_desc.lower() else 0
                })
        server_index += 1
    return datas

def form_level_martix():
    pass