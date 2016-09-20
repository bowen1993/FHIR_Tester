from django.shortcuts import render
from account.models import *
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext, loader
from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.csrf import csrf_exempt
import traceback
import json
import string
import random
from services import auth

@csrf_exempt
def register(request):
    result={
        'isSuccessful':False
    }
    try:
        data = json.loads(request.body)
        username = data['username']
        print username
        password = data['password']
        print password
        if isUsernameValid(username):
            user = User(username=username)
            user.password = make_password(password)
            user.save()
            result['isSuccessful'] = True
        else:
            result['isSuccessful'] = False
            result['error'] = 'Invalid username or password'
    except:
        traceback.print_exec()
        result['isSuccessful'] = False
        result['error'] = 'Invalid username or password'
    finally:
        return HttpResponse(json.dumps(result), content_type="application/json")

def isUsernameValid(username):
    try:
        User.objects.get(username=username)
        return False
    except:
        return True

@csrf_exempt
def login(request):
    result = {
        'isSuccessful':False,
    }
    try:
        received_data = json.loads(request.body)
        username = received_data['username']
        password = received_data['password']
        user_obj = User.objects.get(username=username)
        if check_password(password, user_obj.password):
            result['isSuccessful'] = True
            # create_session(request,username)
            result['token'] = auth.get_token(username)
        else:
            result['error'] = 'login failed, username / password not correct'
    except:
        result['error'] = 'login failed, username / password not correct'
    return HttpResponse(json.dumps(result), content_type="application/json")


def create_session(request, username):
    request.session['isLoggedIn'] = True
    request.session['username'] = username

def destroy_session(request):
    request.session['isLoggedIn'] = False
    del request.session['username']

@csrf_exempt
def logout(request):
    try:
        destroy_session(request)
    except:
        pass
    return HttpResponse()
