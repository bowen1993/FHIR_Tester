from django.shortcuts import render
from services.genomics_test_generator.fhir_genomics_test_gene import *
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext, loader
import json
from home.task_runner import perform_test
from home.models import task, server
from home.search import search_basedon_id
from services import auth
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
    task_id = perform_test(language=language,code=code,url=url,test_type=test_type, access_token=access_token, username=username)
    result = {
        'isSuccessful':True,
        'task_id':task_id
    }
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
def get_all_servers(request):
    result = {
        'isSuccessful' : False
    }
    try:
        server_list = server.objects.all()
        result['servers'] = []
        for server_obj in server_list:
            result['servers'].append({'name':server_obj.server_name,'id':server_obj.server_id,'url':server_obj.server_url})
        result['isSuccessful'] = True
    except:
        pass
    return HttpResponse(json.dumps(result), content_type="application/json")

@csrf_exempt
def get_user_task_history(request):
    req_json = json.loads(request.body)
    token = req_json['token']
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

