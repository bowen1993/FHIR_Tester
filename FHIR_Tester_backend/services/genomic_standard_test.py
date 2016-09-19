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
        case['case']['resourceType'] = resource_type
        all_cases['wrong'].append(case)
    #return all cases
    return all_cases

def iter_all_cases(all_cases, url,id_dict, access_token=None):
    #test right cases
    isSuccessful = True
    hint_info = ''
    for case in all_cases['right']:
        case = set_reference(case,id_dict)
        print case
        response = send_create_resource_request(json.dumps(case), url, access_token)
        if isinstance(response, dict) and 'issue' in response and response['issue'][0]['severity'] == 'information':
            isSuccessful = isSuccessful and True
        else:
            print response
            hint_info += response
            isSuccessful = isSuccessful and False
        if not isSuccessful:
            return isSuccessful, hint_info
    for case_with_info in all_cases['wrong']:
        case = case_with_info['case']
        response = send_create_resource_request(json.dumps(case), url, access_token)
        if isinstance(response, dict) and 'issue' in response and response['issue'][0]['severity'] == 'information':
            print '-'*30
            print 'wrong case error'
            print case
            hint_info += case_with_info['info']
            isSuccessful = isSuccessful and False
        else:
            print response
            isSuccessful = isSuccessful and True
        if not isSuccessful:
            return isSuccessful, hint_info
    return isSuccessful, hint_info

def ana_pre_creation_result(raw_info):
    processed_info = {}
    for key in raw_info:
        if raw_info[key] and 'issue' in raw_info[key]:
            if raw_info[key]['issue'][0]['severity'] == 'information':
                processed_info[key] = True
            else:
                processed_info[key] = False
    return processed_info

def level0Test(url,id_dict, access_token=None):
    #create basic observation
    spec_filename = '%sObservation.csv' % spec_basepath
    all_cases = create_all_test_case4type(spec_filename, 'Observation')
    #send resource
    #do test with all objects
    if not url.endswith('/'):
        url += '/'
    return iter_all_cases(all_cases, '%s%s' % (url, 'Observation'),id_dict, access_token)
    

def level1Test(url,id_dict, access_token):
    spec_filename = '%sObservation.csv' % spec_basepath
    all_cases = create_all_test_case4type(spec_filename, 'Observation')
    right_cases = all_cases['right']
    #add extension specific for genetic profile
    #TODO extension generate
    return True,''

def do_standard_test(url, access_token=None):
    #create pre resources
    test_result = {
        'level':-1,
        'steps':[]
    }
    level = -1
    create_res, id_dict = create_pre_resources(url, 'resources', access_token)
    print id_dict
    pre_resource_result = ana_pre_creation_result(create_res)
    print pre_resource_result
    for key in pre_resource_result:
        if pre_resource_result[key]:
            test_result['steps'].append('%s created successfully' % key)
        else:
            test_result['steps'].append('%s can not be created, test terminated' % key)
            return test_result
    level0TestRes, hint_info = level0Test(url,id_dict, access_token)
    test_result['steps'].append('level 0 test performed, %s' % ('success' if level0TestRes == 1 else 'Failded, %s'%hint_info))
    if not level0TestRes:
        test_result['level'] = level
        return test_result, id_dict
    level += 1
    level1TestRes, hint_info = level1Test(url,id_dict, access_token)
    test_result['steps'].append('level 1 test performed, %s' % ('success' if level1TestRes == 1 else 'Failded, %s'%hint_info))
    if not level1TestRes:
        test_result['level'] = level
        return test_result, id_dict
    test_result['level'] = level
    return test_result, id_dict

