from genomics_test_generator import fhir_genomics_test_gene
from request_sender import *
from services.create_resource import *
import random

resource_list = ['DiagnosticReport', 'FamilyMemberHistory', 'Sequence', 'DiagnosticRequest', 'Observation']
spec_basepath = 'resources/spec/'
resource_basepath = 'resources/json/'

gene_variant_extension = [
    {
      "url": "http://hl7.org/fhir/StructureDefinition/observation-geneticsDNASequenceVariant",
      "valueString": "NG_007726.3:g.146252T>G"
    },
    {
      "url": "http://hl7.org/fhir/StructureDefinition/observation-geneticsGene",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "http://www.genenames.org",
            "code": "3236",
            "display": "EGFR"
          }
        ]
      }
    }
]

genetic_observation_extension = [
    {
      "url": "http://hl7.org/fhir/StructureDefinition/observation-geneticsDNASequenceVariant",
      "valueString": "NG_007726.3:g.146252T>G"
    },
    {
      "url": "http://hl7.org/fhir/StructureDefinition/observation-geneticsGene",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "http://www.genenames.org",
            "code": "3236",
            "display": "EGFR"
          }
        ]
      }
    },
    {
      "url": "http://hl7.org/fhir/StructureDefinition/observation-geneticsDNARegionName",
      "valueString": "Exon 21"
    },
    {
      "url": "http://hl7.org/fhir/StructureDefinition/observation-geneticsGenomicSourceClass",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "http://hl7.org/fhir/LOINC-48002-0-answerlist",
            "code": "LA6684-0",
            "display": "somatic"
          }
        ]
      }
    }
]

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
            if isinstance(response, str):
                hint_info += response
            elif isinstance(response, dict):
                hint_info += response['issue'][0]['diagnostics']
            isSuccessful = isSuccessful and False
        if not isSuccessful:
            return isSuccessful, hint_info
    # for case_with_info in all_cases['wrong']:
    #     case = case_with_info['case']
    #     response = send_create_resource_request(json.dumps(case), url, access_token)
    #     if isinstance(response, dict) and 'issue' in response and response['issue'][0]['severity'] == 'information':
    #         print '-'*30
    #         print 'wrong case error'
    #         print case
    #         hint_info += case_with_info['info']
    #         isSuccessful = isSuccessful and False
    #     else:
    #         print response
    #         isSuccessful = isSuccessful and True
    #     if not isSuccessful:
    #         return isSuccessful, hint_info
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
    isSuccessful = True
    hint_info = ''
    if not url.endswith('/'):
        url += '/'
    url += 'Observation'
    for case in right_cases:
        case = set_reference(case,id_dict)
        case['extension'] = genetic_observation_extension
        print json.dumps(case)
        response = send_create_resource_request(json.dumps(case), url, access_token)
        
        if isinstance(response, dict) and 'issue' in response and response['issue'][0]['severity'] == 'information':
            isSuccessful = isSuccessful and True
        else:
            print response
            if isinstance(response, str):
                hint_info += response
            elif isinstance(response, dict):
                hint_info += response['issue'][0]['diagnostics']
            isSuccessful = isSuccessful and False
        if not isSuccessful:
            return isSuccessful, hint_info
    #TODO extension generate
    return isSuccessful,hint_info

def level2Test(url, id_dict, access_token):
    spec_filename = '%sObservation.csv' % spec_basepath
    all_cases = create_all_test_case4type(spec_filename, 'Observation')
    right_cases = all_cases['right']
    isSuccessful = True
    hint_info = ''
    if not url.endswith('/'):
        url += '/'
    url += 'Observation'
    for case in right_cases:
        case = set_reference(case,id_dict)
        #add gene and Variant extension
        case['extension'] = gene_variant_extension
        print json.dumps(case)
        response = send_create_resource_request(json.dumps(case), url, access_token)
        if isinstance(response, dict) and 'issue' in response and response['issue'][0]['severity'] == 'information':
            isSuccessful = isSuccessful and True
        else:
            print response
            if isinstance(response, str):
                hint_info += response
            elif isinstance(response, dict):
                hint_info += response['issue'][0]['diagnostics']
            isSuccessful = isSuccessful and False
        if not isSuccessful:
            return isSuccessful, hint_info
    #TODO extension generate
    return isSuccessful,hint_info

def level3Test(url, id_dict, access_token):
    spec_filename = '%sSequence.csv' % spec_basepath
    all_cases = create_all_test_case4type(spec_filename, 'Sequence')
    if not url.endswith('/'):
        url += '/'
    return iter_all_cases(all_cases, '%s%s' % (url, 'Sequence'),id_dict, access_token)

def random_picker(pick_list):
    '''
    pick a element from a list randomly

    @param pick_list: list to pick element
    @type pick_list: list
    @return picked item
    @rtype: obj
    '''
    low, high = 0, len(pick_list)-1
    return pick_list[random.randint(low, high)]


def level4Test(url, id_dict, access_token):
    if not url.endswith('/'):
        url += '/'
    isSuccessful = True
    hint_info = ''
    for resource_name in resource_list:
        id_list = get_resource_id_list(url, resource_name, access_token)
        if id_list and len(id_list) > 0: 
            random_id = random_picker(id_list)
            response = send_read_resource_request("%s%s/%s" %(url,resource_name,random_id), access_token)
            if isinstance(response, dict):
                if response['resourceType'] == resource_name:
                    isSuccessful = isSuccessful and True
                else:
                    isSuccessful = isSuccessful and False
                    hint_info += response['issue'][0]['diagnostics']
            else:
                isSuccessful = isSuccessful and False
                hint_info += response
        if not isSuccessful:
            return isSuccessful, hint_info
    return isSuccessful, hint_info

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
    test_result['steps'].append('level 0 test performed, %s' % ('success' if level0TestRes else 'Failded, %s'%hint_info))
    if not level0TestRes:
        test_result['level'] = level
        return test_result, id_dict
    level += 1
    level1TestRes, hint_info = level1Test(url,id_dict, access_token)
    test_result['steps'].append('level 1 test performed, %s' % ('success' if level1TestRes else 'Failded, %s'%hint_info))
    if not level1TestRes:
        test_result['level'] = level
        return test_result, id_dict
    level += 1
    level2TestRes, hint_info = level2Test(url,id_dict, access_token)
    test_result['steps'].append('level 2 test performed, %s' % ('success' if level2TestRes else 'Failded, %s'%hint_info))
    if not level2TestRes:
        test_result['level'] = level
        return test_result, id_dict
    level += 1
    level3TestRes, hint_info = level3Test(url,id_dict, access_token)
    test_result['steps'].append('level 3 test performed, %s' % ('success' if level3TestRes else 'Failded, %s'%hint_info))
    if not level3TestRes:
        test_result['level'] = level
        return test_result, id_dict
    level += 1
    level4TestRes, hint_info = level4Test(url,id_dict, access_token)
    test_result['steps'].append('level 4 test performed, %s' % ('success' if level4TestRes else 'Failded, %s'%hint_info))
    if not level4TestRes:
        test_result['level'] = level
        return test_result, id_dict
    level += 1
    test_result['level'] = level
    return test_result, id_dict

