import base64

def get_token(username):
    return base64.b64encode(username)

def extract_username(token):
    return base64.b64decode(token)