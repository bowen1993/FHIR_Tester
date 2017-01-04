import os
import sys

pro_dir = os.getcwd()
sys.path.append(pro_dir)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "FHIR_Tester.settings")

from services.genomics_test_generator.fhir_genomics_test_gene import *
from services.request_sender import *
from services.create_resource import *

spec_basepath = 'resources/spec/'
resource_basepath = 'resources/json/'

def iter_all_cases(resource_type, all_cases, url,id_dict, access_token=None):
    #test right cases
    print 'test'
    isSuccessful = True
    for case in all_cases['right']:
        case = set_reference(case,id_dict)
        response, req_header, res_header = send_create_resource_request(json.dumps(case), url, access_token)
        if isinstance(response, dict) and 'issue' in response and response['issue'][0]['severity'] == 'information':
            isSuccessful = isSuccessful and True
        else:
            if isinstance(response, str):
                hint += response
            elif isinstance(response, dict):
                hint += response['issue'][0]['diagnostics']
            isSuccessful = isSuccessful and False

    print "%s:Proper %s cases tested:%s" % (resource_type, resource_type, 'success' if isSuccessful else 'fail')
    isSuccessfulFalse = True
    for case_with_info in all_cases['wrong']:
        case = case_with_info['case']
        response, req_header, res_header = send_create_resource_request(json.dumps(case), url, access_token)
        if isinstance(response, dict) and 'issue' in response and response['issue'][0]['severity'] == 'information':
            isSuccessfulFalse = isSuccessfulFalse and False
        else:
            isSuccessfulFalse = isSuccessfulFalse and True
    print "%s:Improper %s cases tested:%s" % (resource_type, resource_type, 'success' if isSuccessfulFalse else 'fail')
    return isSuccessful and isSuccessfulFalse

def test_a_resource(resource_name, url, access_token=None):
    print resource_name
    #setup
    id_dict = setup(url, access_token)
    spec_filename = '%s%s.csv' % (spec_basepath, resource_name)
    print spec_filename
    all_cases = create_all_test_case4type(spec_filename, resource_name)
    if not url.endswith('/'):
        url += '/'
    isSuccessful = iter_all_cases(resource_name, all_cases, '%s%s' % (url, resource_name),id_dict, access_token)
    print "%s:All %s cases tested:%s" % (resource_name, resource_name, 'success' if isSuccessful else 'fail')
    return

def create_all_test_case4type(resource_spec_filename,resource_type):
    #load spec
    csv_reader = csv.reader(open(resource_spec_filename, 'r'))
    detail_dict = trans_csv_to_dict(csv_reader)
    del csv_reader
    #generate all cases
    test_cases = create_element_test_cases(detail_dict)
    right_cases, wrong_cases = create_orthogonal_test_cases(test_cases)
    #wrap test cases
    all_cases = {}
    all_cases['right'] = []
    all_cases['wrong'] = []
    for case in right_cases:
        case['resourceType'] = resource_type
        all_cases['right'].append(case)
    for case in wrong_cases:
        case['case']['resourceType'] = resource_type
        all_cases['wrong'].append(case)
    #return all cases
    return all_cases

def ana_pre_creation_result(raw_info):
    processed_info = {}
    for key in raw_info:
        if raw_info[key] and 'issue' in raw_info[key]:
            if raw_info[key]['issue'][0]['severity'] == 'information':
                processed_info[key] = True
            else:
                processed_info[key] = False
    return processed_info

def setup(url, access_token=None):
    create_res, id_dict = create_pre_resources(url, 'resources', access_token)
    pre_resource_result = ana_pre_creation_result(create_res)
    # print pre_resource_result
    status = True
    for key in pre_resource_result:
        status  = status and pre_resource_result[key]
    print "Setup:Setup:%s" % "success" if status else "fail"
    return id_dict