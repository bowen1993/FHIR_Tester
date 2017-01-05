from genomics_test_generator import fhir_genomics_test_gene
from request_sender import *
from services.create_resource import *
import random
import json
import traceback
import requests

from django.db import transaction
from home.models import task, task_steps, step_detail

resource_list = ['DiagnosticReport', 'FamilyMemberHistory', 'Sequence', 'DiagnosticRequest', 'Observation']
spec_basepath = 'resources/spec/'
resource_basepath = 'resources/json/'
ga4gh_server = 'http://ideaworld.org:6060/'

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

base_fake_path = 'resources/fake_data/'

fake_info = []

def save_step2fake(info):
    fake_info.append({
        'type':'step',
        'info':info
    })

def save_detail2fake(info):
    info['req_header'] = json.dumps(dict(info['req_header'])) if info['req_header'] else None
    info['res_header'] = json.dumps(dict(info['res_header'])) if info['res_header'] else None
    info['resource'] = json.dumps(dict(info['resource'])) if info['resource'] else None
    info['response'] = json.dumps(dict(info['response'])) if info['response'] else None
    fake_info.append({
        'type':'detail',
        'info':info
    })

def save_fake2file():
    file_obj = open('%sfake_fhir.json' % base_fake_path, 'w')
    file_obj.write(json.dumps(fake_info))
    file_obj.close()

def get_right_cases(resource_type):
    basepath = 'resources/resource_file'
    filepath_list = []
    for parentDir, dirnames, filenames in os.walk(basepath):
        for filename in filenames:
            if filename.endswith('json') and resource_type.lower() in filename.lower():
                resource_name = filename[:filename.find('_')] if '_' in filename else filename[:filename.find('.')]
                fullFilename = (parentDir if parentDir.endswith('/') else parentDir + '/') + filename
                if resource_name.lower() == resource_type.lower(): filepath_list.append(fullFilename)
    #get json objs
    cases = []
    for fullFilename in filepath_list:
        f = open(fullFilename, 'r')
        cases.append(json.loads(f.read()))
        f.close()
    return cases
    

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
    all_cases['right'] = get_right_cases(resource_type)
    all_cases['wrong'] = []
    # for case in right_cases:
    #     case['resourceType'] = resource_type
    #     all_cases['right'].append(case)
    # get right cases from files instead
    for case in wrong_cases:
        case['case']['resourceType'] = resource_type
        all_cases['wrong'].append(case)
    #return all cases
    return all_cases

def iter_all_cases(resource_type,step_obj, all_cases, url,id_dict, access_token=None):
    #test right cases
    isSuccessful = True
    hint_infos = []
    for case in all_cases['right']:
        hint = ''
        flag = True
        case = set_reference(case,id_dict)
        if 'id' in case:
            del case['id']
        # case = remove_none(case)
        status_code, response, req_header, res_header = send_create_resource_request(json.dumps(case), url, access_token)
        if status_code == 201 or status_code == 200 :
            isSuccessful = isSuccessful and True
            flag = True
        else:
            if isinstance(response, str):
                hint += response
            elif isinstance(response, dict):
                hint += json.dumps(response['issue'])
            isSuccessful = isSuccessful and False
            flag = False
            hint_infos.append({
                'status': 0,
                'desc': hint,
            })
            save_step_detail(step_obj, {
                'status': 0,
                'desc': 'Resource %s can not be processed. %s' %(resource_type, hint),
                'req_header':req_header,
                'res_header': res_header,
                'response':response,
                'resource':case,
                'resource_name':resource_type
            })
    if isSuccessful:
        hint_infos.append({
                'desc': '%s in correct format can be processed properly' % resource_type,
                'status':2
            })
        save_step_detail(step_obj, {
                'desc': '%s in correct format can be processed properly' % resource_type,
                'status':2,
                'req_header':None,
                'res_header': None,
                'response':None,
                'resource':None,
                'resource_name':resource_type
            })
    isSuccessfulFalse = True
    for case_with_info in all_cases['wrong']:
        case = case_with_info['case']
        hint = ''
        status_code, response, req_header, res_header = send_create_resource_request(json.dumps(case), url, access_token)
        if status_code == 201 or status_code == 200:
            hint += case_with_info['info']
            isSuccessfulFalse = isSuccessfulFalse and False
        else:
            isSuccessfulFalse = isSuccessfulFalse and True
        if not isSuccessfulFalse:
            hint_infos.append({
                'status': 1,
                'desc': hint
            })
            save_step_detail(step_obj, {
                'status': 1,
                'desc': hint,
                'req_header':req_header,
                'res_header': res_header,
                'response':response,
                'resource':case,
                'resource_name':resource_type
            })
    if isSuccessfulFalse:
        hint_infos.append({
                'desc': '%s with error can be handled' % resource_type,
                'status':2
            })
        save_step_detail(step_obj, {
                'desc': '%s in incorrect format can be processed properly' % resource_type,
                'status':2,
                'req_header':None,
                'res_header': None,
                'response':None,
                'resource':None,
                'resource_name':resource_type
            })
    return isSuccessful, hint_infos

def ana_pre_creation_result(raw_info):
    processed_info = {}
    for key in raw_info:
        if raw_info[key] and 'issue' in raw_info[key]:
            if raw_info[key]['issue'][0]['severity'] == 'information':
                processed_info[key] = True
            else:
                processed_info[key] = False
    return processed_info

def level0Test(url,id_dict,step_obj, access_token=None):
    #create basic observation
    spec_filename = '%sObservation.csv' % spec_basepath
    all_cases = create_all_test_case4type(spec_filename, 'Observation')
    #send resource
    #do test with all objects
    if not url.endswith('/'):
        url += '/'
    isSuccessful, hint_infos = iter_all_cases('Observation',step_obj, all_cases, '%s%s' % (url, 'Observation'),id_dict, access_token)
    return isSuccessful, hint_infos
    

def level1Test(url,id_dict,step_obj, access_token):
    spec_filename = '%sObservation.csv' % spec_basepath
    all_cases = create_all_test_case4type(spec_filename, 'Observation')
    right_cases = all_cases['right']
    isSuccessful = True
    hint_infos = []
    if not url.endswith('/'):
        url += '/'
    url += 'Observation'
    for case in right_cases:
        flag = True
        case = set_reference(case,id_dict)
        # case = remove_none(case)
        case['extension'] = genetic_observation_extension
        # print json.dumps(case)
        hint = ''
        status_code, response, req_header, res_header = send_create_resource_request(json.dumps(case), url, access_token)
        print status_code
        print isSuccessful
        if status_code == 201 or status_code == 200 or status_code == '201' or status_code == '200':
            isSuccessful = isSuccessful and True
            flag = True
        else:
            if isinstance(response, str):
                hint += response
            elif isinstance(response, dict):
                hint += json.dumps(response['issue'])
            isSuccessful = isSuccessful and False
            flag = False
            hint_infos.append({
                'status': 0,
                'desc': hint
            })
            save_step_detail(step_obj, {
                'status': 0,
                'desc': hint,
                'req_header':req_header,
                'res_header': res_header,
                'response':response,
                'resource':case,
                'resource_name':'Observation'
            })
    if isSuccessful:
        hint_infos.append({
                'status': 2,
                'desc': 'Observation for genetic profile can be processed properly'
            })
        save_step_detail(step_obj, {
                'desc': 'Observation for genetic profile can be processed properly',
                'status':2,
                'req_header':None,
                'res_header': None,
                'response':None,
                'resource':None,
                'resource_name':'Observation'
            })
    #TODO extension generate
    return isSuccessful,hint_infos

def level2Test(url, id_dict,step_obj, access_token):
    spec_filename = '%sObservation.csv' % spec_basepath
    all_cases = create_all_test_case4type(spec_filename, 'Observation')
    right_cases = all_cases['right']
    isSuccessful = True
    hint_infos = []
    if not url.endswith('/'):
        url += '/'
    url += 'Observation'
    for case in right_cases:
        case = set_reference(case,id_dict)
        # case = remove_none(case)
        #add gene and Variant extension
        case['extension'] = gene_variant_extension
        hint = ''
        # print json.dumps(case)
        status_code, response, req_header, res_header = send_create_resource_request(json.dumps(case), url, access_token)
        if status_code == 200 or status_code == 201:
            isSuccessful = isSuccessful and True
        else:
            if isinstance(response, str):
                hint += response
            elif isinstance(response, dict):
                hint += json.dumps(response['issue'])
            isSuccessful = isSuccessful and False
            hint_infos.append({
                'status': 0,
                'desc': hint
            })
            save_step_detail(step_obj, {
                'status': 0,
                'desc': hint,
                'req_header':req_header,
                'res_header': res_header,
                'response':response,
                'resource':case,
                'resource_name':'Observation'
            })
    if isSuccessful:
        hint_infos.append({
                'status':2,
                'desc':'Observation with Gene extension can be processed properly'
            })
        save_step_detail(step_obj, {
                'desc': 'Observation with Gene extension can be processed properly',
                'status':2,
                'req_header':None,
                'res_header': None,
                'response':None,
                'resource':None,
                'resource_name':'Observation'
            })
    return isSuccessful,hint_infos

def level3Test(url, id_dict,step_obj, access_token):
    spec_filename = '%sSequence.csv' % spec_basepath
    all_cases = create_all_test_case4type(spec_filename, 'Sequence')
    if not url.endswith('/'):
        url += '/'
    return iter_all_cases('Sequence',step_obj, all_cases, '%s%s' % (url, 'Sequence'),id_dict, access_token)

def level4Test(url, id_dict, step_obj, access_token):
    if not url.endswith('/'):
        url += '/'
    isSuccessful = True
    hint = ''
    hint_infos = []
    #get sequence resource file with repo
    resource_filepath = '%sSequence_repo.json' % 'resources/resource_file/'
    resource_file = open(resource_filepath,'r')
    resource_obj = json.loads(resource_file.read())
    print id_dict
    resource_obj = set_reference(resource_obj,id_dict)
    status_code, response, req_header, res_header = send_create_resource_request(json.dumps(resource_obj),'%sSequence'% url, access_token)
    print 'sequence create %d' % status_code
    if status_code != 200 and status_code != 201 and 'resourceType' in response:
        isSuccessful = False
        if isinstance(response, str):
            hint += response
        elif isinstance(response, dict):
            hint += json.dumps(response['issue'])
    else:
        resource_id = None
        if response['resourceType'] == 'OperationOutcome':
            try:
                issue_desc = response['issue'][0]
                if issue_desc['severity'] == 'information':
                    resource_id = issue_desc['diagnostics'].split('/')[1]
            except:
                pass
        elif response['resourceType'] == 'Sequence':
            try:
                resource_id = response['id']
            except:
                pass
        #send read resource and then read ga4gh repo
        if resource_id and len(resource_id) != 0:
            isRepoSuccessful, req_header, res_heander = read_repo(resource_id, url, access_token)
            isSuccessful = isSuccessful & isRepoSuccessful
        else:
            isSuccessful = False
    hint_infos.append({
            'status':2 if isSuccessful else 0,
            'desc':'Repository %s be read' % ('can' if isSuccessful else 'cannot')
        })
    save_step_detail(step_obj, {
            'desc':'Repository %s be read' % ('can' if isSuccessful else 'cannot'),
            'status':2 if isSuccessful else 0,
            'req_header':req_header,
            'res_header': res_header,
            'response':None if isSuccessful else response,
            'resource':None,
            'resource_name':'Sequence'
        })
    return isSuccessful, hint_infos


def read_repo(resource_id, url, access_token):
    print resource_id
    print 'reading repo'
    status_code, response, req_header, res_header = send_read_resource_request("%sSequence/%s" %(url,resource_id), access_token)
    isSuccessful = True
    print 'sequence read %d' % status_code
    if status_code >= 300:
        isSuccessful = False
        return isSuccessful,req_header,res_header
    #read ga4gh
    else:
        variantId = None
        print 'response'
        print response['repository']
        #get variant id
        try:
            variantId = response['repository'][0]['variantId']
        except:
            pass
        print variantId
        if variantId and len(variantId) != 0:
            r = requests.get('%svariants/%s' % (ga4gh_server, variantId))
            print r.status_code
            if r.status_code > 300:
                isSuccessful = False
            return isSuccessful,r.request.headers, r.headers
    return True, None, None


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

# def level4Test(url, id_dict, step_obj, access_token):
#     if not url.endswith('/'):
#         url += '/'
#     isSuccessful = True
#     hint_infos = []


def level5Test(url, id_dict,step_obj, access_token):
    if not url.endswith('/'):
        url += '/'
    isSuccessful = True
    hint_infos = []
    for resource_name in resource_list:
        id_list = get_resource_id_list(url, resource_name, access_token)
        hint = ''
        flag = True
        req_header = None
        res_header = None
        response = None
        if id_list and len(id_list) > 0: 
            random_id = random_picker(id_list)
            status_code, response, req_header, res_header = send_read_resource_request("%s%s/%s" %(url,resource_name,random_id), access_token)
            if status_code == 201 or status_code == 200 or status_code == 302:
                isSuccessful = isSuccessful and True
                flag = True
            else:
                flag = False
                isSuccessful = isSuccessful and False
                # hint += response
        if not isSuccessful:
            hint_infos.append({
                'status':0,
                'desc': '%s reading failed, %s' % (resource_name, hint)
            })
        save_step_detail(step_obj, {
            'status': 2 if flag else 0,
            'resource_name':resource_name,
            'desc': '%s reading %s, %s' % (resource_name, ('Success' if flag else 'Fail') ,hint),
            'req_header':req_header,
            'res_header': res_header,
            'response':response,
            'resource':None
        })
    if isSuccessful:
        hint_infos.append({
                'status':2,
                'desc':'FHIR Genomics Resources can be retrived'
            })
        # save_step_detail(step_obj, {
        #         'desc': 'FHIR Genomics Resources can be retrived',
        #         'status':True,
        #         'req_header':None,
        #         'res_header': None,
        #         'response':None,
        #         'resource':None,
        #         'resource_name':None
        #     })
    return isSuccessful, hint_infos

def save_step_detail(step_obj, detail_info):
    print detail_info['response']
    with transaction.atomic():
        new_step_detail = step_detail(step=step_obj)
        new_step_detail.detail_desc = detail_info['desc']
        new_step_detail.detail_status = detail_info['status']
        new_step_detail.http_request = json.dumps(dict(detail_info['req_header'])) if detail_info['req_header'] else None
        new_step_detail.http_response = json.dumps(dict(detail_info['res_header'])) if detail_info['res_header'] else None
        new_step_detail.request_resource = json.dumps(dict(detail_info['resource'])) if detail_info['resource'] else None
        new_step_detail.response_message = json.dumps(dict(detail_info['response'])) if detail_info['response'] else None
        new_step_detail.resource_name = detail_info['resource_name']
        try:
            new_step_detail.save()
        except:
            print 'live create failed'

def create_one_step(task_id, step_info, step_obj=None):
    save_step2fake(step_info)
    if step_obj:
        with transaction.atomic():
            try:
                step_obj.step_desc = step_info['desc']
                step_obj.save()
                return step_obj
            except:
                return None
                pass
    else:
        with transaction.atomic():
            new_task_step = task_steps(task_id=task_id, step_desc = step_info['desc'], name=step_info['name'])
            try:
                new_task_step.save()
            except:
                traceback.print_exc()
                print 'step can not be created'
                return None
            return new_task_step

def form_new_step_info(status, base_desc, details,name):
    new_step = {
        'status': status,
        'desc': base_desc,
        'details': details,
        'name':name
    }
    return new_step

def perform_a_test(test_method,step_obj ,url, id_dict, base_desc,name=None, access_token=None):
    isSuccessful, hint_infos = test_method(url, id_dict, step_obj, access_token)
    step_info = form_new_step_info(isSuccessful,'%s %s' % (base_desc, 'successfully' if isSuccessful else 'failed'), hint_infos, name)
    return step_info

def do_standard_test(task_id, url, access_token=None, resources=["0","1","2","3","4","5"]):
    #create pre resources
    test_result = {
        'level':[],
        'steps':[]
    }
    level = []
    step_info = form_new_step_info(True, 'Setting up standard test......', [], 'Setup')
    step_obj = create_one_step(task_id ,step_info)
    create_res, id_dict = create_pre_resources(url, 'resources', access_token)
    # print id_dict
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
    create_one_step(task_id ,step_info, step_obj)
    #standard test begin
    
    if "0" in resources:
        step_info = form_new_step_info(True, 'Level 0 test performing', [], 'Level 0')
        step_obj = create_one_step(task_id ,step_info)
        step_info = perform_a_test(level0Test,step_obj, url, id_dict, 'Level 0 test', 'Level 0', access_token)
        create_one_step(task_id, step_info, step_obj)
        if step_info['status']:
            test_result['level'].append('0')
    if "1" in resources:
        step_info = form_new_step_info(True, 'Level 1 test performing', [],'Level 1')
        step_obj = create_one_step(task_id ,step_info)
        step_info = perform_a_test(level1Test,step_obj, url, id_dict, 'Level 1 test', 'Level 1', access_token)
        create_one_step(task_id, step_info, step_obj)
        if step_info['status']:
            test_result['level'].append('1')

    if "2" in resources:
        step_info = form_new_step_info(True, 'Level 2 test performing', [],'Level 2')
        step_obj = create_one_step(task_id ,step_info)
        step_info = perform_a_test(level2Test,step_obj, url, id_dict, 'Level 2 test','Level 2', access_token)
        create_one_step(task_id, step_info, step_obj)
        if step_info['status']:
            test_result['level'].append('2')
    if "3" in resources:
        step_info = form_new_step_info(True, 'Level 3 test performing', [],'Level 3')
        step_obj = create_one_step(task_id ,step_info)
        step_info = perform_a_test(level3Test,step_obj, url, id_dict, 'Level 3 test','Level 3', access_token)
        create_one_step(task_id, step_info, step_obj)
        if step_info['status']:
            test_result['level'].append('3')
    if "4" in resources:
        step_info = form_new_step_info(True, 'Level 4 test performing', [], 'Level 4')
        step_obj = create_one_step(task_id, step_info)
        step_info = perform_a_test(level4Test,step_obj,url, id_dict,'Level 4 test', 'Level 4', access_token)
        create_one_step(task_id, step_info, step_obj)
        if step_info['status']:
            test_result['level'].append('4')
    if "5" in resources:
        step_info = form_new_step_info(True, 'Level 5 test performing', [],'Level 5')
        step_obj = create_one_step(task_id ,step_info)
        step_info = perform_a_test(level5Test,step_obj, url, id_dict, 'Level 5 test','Level 5', access_token)
        create_one_step(task_id, step_info, step_obj)
        if step_info['status']:
            test_result['level'].append('5')
    #save_fake2file()
    return test_result['level'], id_dict

