from django.shortcuts import render
from services.genomics_test_generator.fhir_genomics_test_gene import *
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext, loader
import json
from home.task_runner import perform_test
from home.models import task, server, resource
from home.search import search_basedon_id
from services import auth
from home.matrix import form_resource_martix, form_level_martix,form_matrix
import traceback
# Create your views here.

@csrf_exempt
def submit_task(request):
    #get code, language, type
    req_json = json.loads(request.body)
    print req_json
    code = req_json['code']
    language = req_json['language']
    test_type = req_json['type']
    resource_list = []
    if test_type == 3 or test_type == 0:
        resource_state = req_json['resources']
        print resource_state
        for item in resource_state:
            if item['checked']:
                resource_list.append(item['name'])
    print resource_list
        
    if 'chosen_server' in req_json:
        #ser url and access token
        try:
            server_obj = server.objects.get(server_id=int(req_json['chosen_server']))
            url = server_obj.server_url
            access_token = server_obj.access_token
        except:
            traceback.print_exc()
            result = {
                'isSuccessful':False,
                'error':"Invalid server"
            }
            return HttpResponse(json.dumps(result), content_type="application/json")
    else:
        access_token = req_json['access_token']
        url = req_json['url']
    token = None
    try:
        token = req_json['token']
    except:
        pass
    username = None
    if token:
        username = auth.extract_username(token)
    print access_token
    
    #return task id
    if 'chosen_server' in req_json:
        task_id = perform_test(language=language,code=code,url=url,test_type=test_type,server_id=req_json['chosen_server'], resource_list=resource_list, access_token=access_token, username=username)
    else:
        task_id = perform_test(language=language,code=code,url=url,test_type=test_type,server_id=None, resource_list=resource_list, access_token=access_token, username=username)
    result = {
        'isSuccessful':True,
        'task_id':task_id
    }
    return HttpResponse(json.dumps(result), content_type="application/json")

@csrf_exempt
def get_resource_matrix(request):
    result = form_resource_martix()
    return HttpResponse(json.dumps(result), content_type="application/json")

@csrf_exempt
def get_resources(request):
    resource_type = request.GET.get('type', 0)
    if isinstance(resource_type,str):
        try:
            resource_type = int(resource_type)
        except:
            resource_type = 0
    result = {
        'isSuccessful':False,
        'names':[]
    }
    try:
        resources = resource.objects.filter(resource_type=resource_type)
        for resource_obj in resources:
            result['names'].append({'name':resource_obj.name,'checked':True})
        result['isSuccessful'] = True
    except:
        pass
    return HttpResponse(json.dumps(result), content_type="application/json")



@csrf_exempt
def add_new_server(request):
    req_json = json.loads(request.body)
    result = {
        'isSuccessful': False
    }
    try:
        server_name = req_json['name']
        server_url = req_json['url']
        access_token = None
        if 'token' in req_json:
            access_token = req_json['token']
        new_server = server(server_name=server_name,server_url=server_url,access_token=access_token)
        new_server.save()
        result['isSuccessful'] = True
    except:
        pass
    return HttpResponse(json.dumps(result), content_type="application/json")

@csrf_exempt
def delete_server(request):
    req_json = json.loads(request.body)
    result = {
        'isSuccessful': False
    }
    try:
        server_id = req_json['id']
        server_obj = server.objects.get(server_id=server_id)
        if server_obj.is_deletable:
            server_obj.is_delete = True
            server_obj.save()
            result['isSuccessful'] = True
        else:
            result['error'] = 'No access to delete this server'
    except:
        result['error'] = 'problem while deleting'
    return HttpResponse(json.dumps(result), content_type='application/json')


@csrf_exempt
def get_all_servers(request):
    result = {
        'isSuccessful' : False
    }
    try:
        server_list = server.objects.filter(is_delete=False)
        result['servers'] = []
        for server_obj in server_list:
            result['servers'].append({'name':server_obj.server_name,'id':server_obj.server_id,'url':server_obj.server_url, 'is_deletable':server_obj.is_deletable})
        result['isSuccessful'] = True
    except:
        pass
    return HttpResponse(json.dumps(result), content_type="application/json")

@csrf_exempt
def get_user_task_history(request):
    req_json = json.loads(request.body)
    try:
        token = req_json['token']
    except:
        return {
                'isSuccessful': False
            }
    result = {
        'isSuccessful': False
    }
    if token:
        try:
            username = auth.extract_username(token)
            task_obj_list = task.objects.filter(user_id=username)
            task_list = []
            for task_obj in task_obj_list:
                task_id = task_obj.task_id
                task_time = task_obj.create_time
                task_list.append({
                    'task_id':task_id,
                    'time':task_time.strftime("%Y-%m-%d")
                })
            result['tasks'] = task_list
            result['isSuccessful'] = True
        except:
            pass
    return HttpResponse(json.dumps(result), content_type="application/json")

@csrf_exempt
def search_task(request):
    req_json = json.loads(request.body)
    keyword = req_json['keyword']
    result = {
        'isSuccessful': True
    }
    result['tasks'] = search_basedon_id(keyword)
    return HttpResponse(json.dumps(result), content_type="application/json")


@csrf_exempt
def all_test_time(request):
    req_json = json.loads(request.body)
    ttype = req_json['ttype']
    result = {
        'isSuccessful':True
    }
    time_list = task.objects.filter(task_type=ttype).values_list('create_time', flat=True)
    strtime_list = []
    for time_obj in time_list:
        strtime_list.append(time_obj.strftime('%Y-%m-%d %H:%M:%S'))
    result['times'] = strtime_list
    return HttpResponse(json.dumps(result), content_type="application/json")

@csrf_exempt
def get_certain_matrix(request):
    req_json = json.loads(request.body)
    ttype = str(req_json['ttype'])
    result = {
        'isSuccessful':True
    }
    ttime = None
    if 'time' in req_json:
        ttime = req_json['time']
    print ttime,ttype
    result['matrix'] = form_matrix(ttype, ttime)
    return HttpResponse(json.dumps(result), content_type="application/json")
