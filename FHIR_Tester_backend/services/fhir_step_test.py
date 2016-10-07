from genomics_test_generator import fhir_genomics_test_gene
from request_sender import *
from genomic_standard_test import *
from services.create_resource import *
import random
import json

from django.db import transaction
from home.models import task, task_steps, step_detail

spec_basepath = 'resources/spec/'
resource_basepath = 'resources/json/'

def test_a_resource(resource_name, url,id_dict,step_obj, access_token=None):
    spec_filename = '%s%s.csv' % (spec_basepath, resource_name)
    all_cases = create_all_test_case4type(spec_filename, resource_name)
    #send resource
    #do test with all objects
    if not url.endswith('/'):
        url += '/'
    isSuccessful, hint_infos = iter_all_cases(resource_name,step_obj, all_cases, '%s%s' % (url, resource_name),id_dict, access_token)
    return isSuccessful, hint_infos

def perform_resource_test(resource_name,step_obj ,url, id_dict, base_desc,name=None, access_token=None):
    isSuccessful, hint_infos = test_a_resource(resource_name,url, id_dict, step_obj, access_token)
    step_info = form_new_step_info(isSuccessful,'%s %s' % (base_desc, 'successfully' if isSuccessful else 'failed'), hint_infos, name)
    return step_info

def setup(task_id, url, access_token=None):
    step_info = form_new_step_info(True, 'Setting up standard test......', [], 'Setup')
    step_obj = create_one_step(task_id ,step_info)
    create_res, id_dict = create_pre_resources(url, 'resources', access_token)
    pre_resource_result = ana_pre_creation_result(create_res)
    # print pre_resource_result
    status = True
    details = []
    for key in pre_resource_result:
        status  = status and pre_resource_result[key]
        detail_info = {'status': pre_resource_result[key]}
        if pre_resource_result[key]:
            detail_info['desc'] = '%s created successfully' % key
        else:
            detail_info['desc'] = '%s can not be created, test terminated' % key
        details.append(detail_info)
    step_info = form_new_step_info(status,'%s %s' % ('Setup', 'Successfully' if status else 'Failed'), details, 'Setup')
    return id_dict

def test_resources(resource_list, task_id, url, access_token=None):
    id_dict = setup(task_id, url, access_token)
    for resource_name in resource_list:
        step_info = form_new_step_info(True, 'Testing resource %s' % resource_name, [], resource_name)
        step_obj = create_one_step(task_id ,step_info)
        step_info = perform_resource_test(resource_name,step_obj ,url, id_dict, '%s test' % resource_name, resource_name, access_token=None)
        create_one_step(task_id, step_info, step_obj)
    return id_dict

