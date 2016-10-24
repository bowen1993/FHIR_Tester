from home.models import task, task_steps,resource,server

def find_resource(name,target):
    for i in range(len(target)):
        if target[i]['name'] == name:
            return i
    return -1


def form_resource_martix():
    datas = {
        'servers':[],
        'resources':[],
        'links':[]
    }
    #get resources
    resource_list = resource.objects.all()
    for resource_obj in resource_list:
        datas['resources'].append({'name':resource_obj.name})
    server_list = server.objects.all()
    server_index = 0
    for server_obj in server_list:
        datas['servers'].append({'name':server_obj.server_name})
        task_list = task.objects.filter(task_type=3,target_server=server_obj).order_by('-create_time').values_list('task_id',flat=True)
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