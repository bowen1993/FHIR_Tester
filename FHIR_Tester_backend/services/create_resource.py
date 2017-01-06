from services.request_sender import *
from services.genomics_test_generator.fhir_genomics_test_gene import *
import os
import json

base_resource_list = ['Patient','Device','Encounter','ImagingStudy','Media', 'Observation', 'Practitioner', 'Provenance','Specimen', 'DiagnosticRequest', 'Organization']

def create_pre_resources(url, basepath, access_token=None):
    #walk through all resource files
    print url
    if not basepath.endswith('/'):
        basepath += '/'
    create_result = {}
    if url and len(url) != 0:
        filepath_dict = {}
        id_dict = {}
        print 'getting resource file'
        for parentDir, dirnames, filenames in os.walk(basepath):
            for filename in filenames:
                if filename.endswith('json'):
                    resource_name = filename[:filename.find('_')] if '_' in filename else filename[:filename.find('.')]
                    fullFilename = (parentDir if parentDir.endswith('/') else parentDir + '/') + filename
                    if resource_name in filepath_dict:
                        filepath_dict[resource_name].append(fullFilename)
                    else:
                        filepath_dict[resource_name] = [fullFilename]
        print 'file getted'
        for resource_name in base_resource_list:
            if not url.endswith('/'):
                    url += '/'
            ids = get_resource_id_list(url, resource_name, access_token)
            print resource_name
            print ids
            if ids:
                id_dict[resource_name] = ids
                print '%s exists, passing' % resource_name
                continue
            for fullFilename in filepath_dict[resource_name]:
                resource_file = open(fullFilename, 'r')
                resource_obj = json.loads(resource_file.read())
                resource_obj = set_reference(resource_obj,id_dict)
                if not url.endswith('/'):
                    url += '/'
                response = send_create_resource_request(json.dumps(resource_obj),'%s%s'%(url, resource_name), access_token)
                create_result[resource_name] = response
                ids = get_resource_id_list(url, resource_name, access_token)
                if ids:
                    id_dict[resource_name] = ids
    return create_result, id_dict

def get_resource_id_list(url, resource_name, access_token=None):
    entry_obj = send_fetch_resource_request(url, resource_name, access_token)
    if entry_obj:
        return fetch_resource_id_list(entry_obj)
    else:
        return None

def fetch_resource_id_list(entry_obj):
    id_list = map(lambda x: x['resource']['id'], entry_obj)
    return id_list

def remove_none(resource_obj):
    if isinstance(resource_obj, dict):
        for key in resource_obj.keys() :
            if resource_obj[key] is None:
                del resource_obj[key]
            elif isinstance(resource_obj[key], dict):
                resource_obj[key] = remove_none(resource_obj[key])
            elif isinstance(resource_obj[key], list):
                for i in xrange(len(resource_obj[key])):
                    resource_obj[key][i] = remove_none(resource_obj[key][i])
    return resource_obj

def set_reference(resource_obj,id_dict):
    if not isinstance(resource_obj, dict):
        return resource_obj
    for key in resource_obj:
        item = resource_obj[key]
        if isinstance(item, unicode) or isinstance(item, str):
            if key.lower() == 'reference':
                reference_type = item[:item.find('/')]
                if reference_type in id_dict:
                    resource_obj[key] = '%s/%s' % (reference_type, id_dict[reference_type][0])
            else:
                continue
        if isinstance(item, list):
            for element in item:
                element = set_reference(element, id_dict)
        if isinstance(item, dict):
            item = set_reference(item, id_dict)
    return resource_obj

