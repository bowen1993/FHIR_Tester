from home.models import task

def search_basedon_id(keyword):
    task_list = task.objects.filter(task_id__contains=keyword)
    res_list = []
    for task_obj in task_list:
        task_id = task_obj.task_id
        task_time = task_obj.create_time
        res_list.append({
            'task_id':task_id,
            'time':task_time.strftime("%Y-%m-%d")
        })
    return res_list

