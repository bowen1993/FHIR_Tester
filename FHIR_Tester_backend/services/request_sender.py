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
