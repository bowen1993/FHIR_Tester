from services.request_sender import *
from services.genomics_test_generator.fhir_genomics_test_gene import *
import os

def create_pre_resources(url, basepath, access_token=None):
    #walk through all resource files
    print url
    create_result = {}
    if url and len(url) != 0:
        for parentDir, dirnames, filenames in os.walk(basepath):
            for filename in filenames:
                if filename.endswith('json'):
                    resource_name = filename[:filename.find('_')] if '_' in filename else filename[:filename.find('.')]
                    fullFilename = (parentDir if parentDir.endswith('/') else parentDir + '/') + filename
                    resource_file = open(fullFilename, 'r')
                    resource_obj = resource_file.read()
                    if not url.endswith('/'):
                        url += '/'
                    response = send_create_resource_request(resource_obj,'%s%s'%(url, resource_name), access_token)
                    print response
                    create_result[resource_name] = response
    return create_result