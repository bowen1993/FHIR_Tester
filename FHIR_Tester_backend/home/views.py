from django.shortcuts import render
from services.genomics_test_generator.fhir_genomics_test_gene import *
from django.views.decorators.csrf import csrf_exempt
import traceback
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext, loader
import json
# Create your views here.

def submit_task(request):
    result = {}
    return HttpResponse(json.dumps(result), content_type="application/json")