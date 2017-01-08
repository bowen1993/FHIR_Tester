import requests
import traceback

def send_create_resource_request(resource_obj, url, access_token=None):
    try:
        if access_token and len(access_token) != 0:
            r = requests.post('%s?_format=json'%url, data=resource_obj, headers={'Content-Type':'application/json','Accept':'application/json','Authorization':'Bearer %s'% access_token})
        else:
            r = requests.post('%s?_format=json'%url, data=resource_obj, headers={'Content-Type':'application/json','Accept':'application/json'})
        try:
            response_json = r.json()
            print 'success'
            return r.status_code, response_json, r.request.headers, r.headers
        except:
            print 'No json'
            return r.status_code, r.text, r.request.headers, r.headers
    except:
        traceback.print_exc()
        print 'server failed'
        return 500, 'Server Error', None, None

def send_read_resource_request(url, access_token):
    print url
    try:
        if access_token and len(access_token) != 0:
            r = requests.get('%s?_format=json'%url, headers={'Content-Type':'application/json','Accept':'application/json','Authorization':'Bearer %s'% access_token})
        else:
            r = requests.get('%s?_format=json'%url, headers={'Contety-Type':'application/json','Accept':'application/json'})
        try:
            response_json = r.json()
            return r.status_code, response_json, r.request.headers, r.headers
        except:
            return r.status_code, r.text, r.request.headers, r.headers
    except:
        traceback.print_exc()
        return 500, 'Server Error', r.request.headers, None

def send_fetch_resource_request(url, resource_name, access_token=None):
    try:
        if access_token and len(access_token) != 0:
            r = requests.get('%s%s?_format=json' % (url, resource_name), headers={'Content-Type':'application/json','Accept':'application/json','Authorization':'Bearer %s'% access_token})
        else:
            r = requests.get('%s%s?_format=json' % (url, resource_name), headers={'Contety-Type':'application/json','Accept':'application/json'})
        try:
            response_json = r.json()
            if response_json['total'] != 0 and 'entry' in response_json:
                return response_json['entry']
            else:
                return None
        except:
            return None
    except:
        return None
    return None


