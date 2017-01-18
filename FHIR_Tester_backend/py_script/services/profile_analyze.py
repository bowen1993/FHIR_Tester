import json
import requests

class ProfileAnalyser(Object):
    def __init__(self):
        self.error_msg = ""
        self.error = False
        self.profile_dict = None
        self.isFinal = False
        self.profile_name = ""

    def load_from_url(self, url):
        '''
        load profile from url

        @param url: profile url
        @type url: str
        '''
        self.url = url
        self.isFinal = False
        try:
            r = requests.get(url)
            self.profile_obj = r.json()
            self.json_str = r.text
            self.error = False
        except:
            self.error = True
            self.error_msg = "can not retrive json"

    def load_from_string(self, json_str):
        '''
        load profile from string

        @param json_str: profile json string
        @type json_str: str
        '''
        self.json_str = json_str
        self.isFinal = False
        try:
            self.profile_obj = json.loads(json_str)
            self.error = False
        except:
            self.error = True
            self.error_msg = "can not load json string"

    def _analyze(self):
        '''
        analyze profile json object
        '''
        if self.error or self.isFinal:
            return
        self.profile_name = self.profile_obj['name']
        self.resource_name = self.profile_name[:self.profile_name.find('-')]
        elements = self.profile_obj['snapshot']['element']
        for element in elements[1:]:
            path = element['path']
            
