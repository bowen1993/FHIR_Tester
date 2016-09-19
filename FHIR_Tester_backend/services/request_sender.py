import requests
import traceback

def send_create_resource_request(resource_obj, url, access_token=None):
    print url
    try:
        if access_token and len(access_token) != 0:
            r = requests.post(url, data=resource_obj, headers={'Content-Type':'application/json','Authorization':'Bearer %s'% access_token})
        else:
            r = requests.post(url,data=resource_obj)
        try:
            response_json = r.json()
            return response_json
        except:
            return r.text
    except:
        traceback.print_exc()
        return 'Server Error'

def send_fetch_resource_request(url, resource_name, access_token=None):
    try:
        if access_token and len(access_token) != 0:
            r = requests.get('%s%s' % (url, resource_name), headers={'Content-Type':'application/json','Authorization':'Bearer %s'% access_token})
        else:
            r = requests.get('%s%s' % (url, resource_name))
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


