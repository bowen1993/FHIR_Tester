from django.shortcuts import render
from services.genomics_test_generator.fhir_genomics_test_gene import *
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext, loader
import json
from home.task_runner import perform_test
from services import auth
# Create your views here.

@csrf_exempt
def submit_task(request):
    #get code, language, type
    req_json = json.loads(request.body)
    print req_json
    code = req_json['code']
    language = req_json['language']
    test_type = req_json['type']
    access_token = req_json['access_token']
    token = req_json['token']
    username = None
    if token:
        username = auth.extract_username(token)
    print access_token
    url = req_json['url']
    #return task id
    task_id = perform_test(language=language,code=code,url=url,test_type=test_type, access_token=access_token, username=username)
    result = {
        'task_id':task_id
    }
    return HttpResponse(json.dumps(result), content_type="application/json")