from genomics_test_generator import fhir_genomics_test_gene
from request_sender import *

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

def level0Test(url, access_token=None):
    #create basic observation
    spec_filename = '%sObservation.csv' % spec_basepath
    all_cases = create_all_test_case4type(spec_filename, Observation)
    #send resource
    #do test with all objects
    isSuccessful = iter_all_cases(all_cases, url, access_token)
    return isSuccessful

def level1Test(url, access_token):
    spec_filename = '%sObservation.csv' % spec_basepath
    all_cases = create_all_test_case4type(spec_filename, Observation)
    right_cases = all_cases['right']
    #add extension specific for genetic profile
    #TODO extension generate
    return True

def do_standard_test(url, access_token=None):
    is_0_pass = level0Test(url, access_token)
