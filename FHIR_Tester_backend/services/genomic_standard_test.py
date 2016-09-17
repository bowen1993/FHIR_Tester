from genomics_test_generator import fhir_genomics_test_gene
from request_sender import *
from services.create_resource import *

resource_list = ['DiagnosticReport', 'FamilyMemberHistory', 'Sequence', 'DiagnosticRequest', 'Observation']
spec_basepath = 'resources/spec/'
resource_basepath = 'resources/json/'

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
        case['resourceType'] = resource_type
        all_cases['wrong'].append(case)
    #return all cases
    return all_cases

def iter_all_cases(all_cases, url, access_token=None):
    #test right cases
    isSuccessful = True
    for case in all_cases['right']:
        response = send_create_resource_request(case, url, access_token)
        if isinstance(response, dict) and 'issue' in response and response['issue'][0]['severity'] == 'information':
            isSuccessful = isSuccessful and True
        else:
            isSuccessful = isSuccessful and False
    for case in all_cases['wrong']:
        response = send_create_resource_request(case, url, access_token)
        if isinstance(response, dict) and 'issue' in response and response['issue'][0]['severity'] == 'information':
            isSuccessful = isSuccessful and False
        else:
            isSuccessful = isSuccessful and True
    return isSuccessful

def ana_pre_creation_result(raw_info):
    processed_info = {}
    for key in raw_info:
        if raw_info[key] and 'issue' in raw_info[key]:
            if raw_info[key]['issue'][0]['severity'] == 'information':
                processed_info[key] = True
            else:
                processed_info[key] = False
    return processed_info

def level0Test(url, access_token=None):
    #create basic observation
    spec_filename = '%sObservation.csv' % spec_basepath
    all_cases = create_all_test_case4type(spec_filename, Observation)
    #send resource
    #do test with all objects
    isSuccessful = iter_all_cases(all_cases, url, access_token)
    return 1 if isSuccessful else 0

def level1Test(url, access_token):
    spec_filename = '%sObservation.csv' % spec_basepath
    all_cases = create_all_test_case4type(spec_filename, Observation)
    right_cases = all_cases['right']
    #add extension specific for genetic profile
    #TODO extension generate
    return 1

def do_standard_test(url, access_token=None):
    #create pre resources
    test_result = {
        'level':-1,
        'steps':[]
    }
    level = -1
    pre_resource_result = ana_pre_creation_result(create_pre_resources(url, 'resources', access_token))
    print pre_resource_result
    for key in pre_resource_result:
        if pre_resource_result[key]:
            test_result['steps'].append('%s created successfully' % key)
        else:
            test_result['steps'].append('%s can not be created, test terminated' % key)
            return test_result

    level += level0Test(url, access_token)
    test_result['steps'].append('level 0 test performed')
    level += level1Test(url, access_token)
    test_result['steps'].append('level 1 test performed')
    test_result['level'] = level
    print test_result
    return test_result

