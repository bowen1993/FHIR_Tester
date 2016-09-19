'''
automative test case generator based on resource defination
@author: Bowen
'''

import csv
import json
import random
import string
from datetime import datetime, date
from type_generator import *

customed_multi_list = []


possibles = globals().copy()
possibles.update(locals())

def remove_prefix(element):
    if '.' in element:
        return element[element.find('.')+1:]
    else:
        return element

def get_prefix(element):
    return element[:element.find('.')]

def is_sub_element(element):
    return ['.' in element, None if '.' not in element else element[:element.find('.')]]

def is_sub(element):
    return '.' in element

def control_analyze(control_str):
    if control_str == '0..0':
        return 0
    if control_str == '0..1':
        return 1
    if control_str == '0..*':
        return 2
    if control_str == '1..1':
        return 3
    if control_str == '1..*':
        return 4

def create_one_case(element_type, demand_value=None):
    '''
    create ont test case for a certain type. type can be generate without and value

    @param element_type: type to be generated, required
    @type element_type: str
    @param demand_value: user defined datas
    @type demand_value: dict
    @return generated type value
    '''
    if 'reference' in element_type.lower():
        element_type = 'reference'
    method_name = 'create_%s' % element_type.lower()
    method = possibles.get(method_name)
    if not method:
        return None
    if demand_value:
        return method(**demand_value)
    else:
        return method()

def create_cases(element_type, length, demand_values=None):
    if length < 1:
        return None
    if length == 1:
        return create_one_case(element_type, demand_values[0] if demand_values else None)
    results = []
    if element_type.lower() in customed_multi_list:
        method_name = 'create_multi_%s'%element_type.lower()
        method = possibles.get(method_name)
        if not method:
            pass
        else:
            results.extend(method(length,demand_values))
    else:
        for i in range(length):
            results.append(create_one_case(element_type,demand_values[i] if demand_values else None))
    return results

def create_all_cases_for_type(element_type, control, bindings=None):
    results = {
    'right':[],
    'wrong':[]
    }
    #create right cases
    if control == 0:
        results['right'].append(None)
    elif control == 1:
        results['right'].append(None)
        results['right'].append(create_cases(element_type, 1, [bindings]))
    elif control == 2:
        results['right'].append(None)
        results['right'].append([create_cases(element_type, 1, [bindings])])
        results['right'].append(create_cases(element_type, 2, [bindings, bindings]))
    elif control == 3:
        results['right'].append(create_cases(element_type, 1, [bindings]))
    elif control == 4:
        results['right'].append([create_cases(element_type, 1, [bindings])])
        results['right'].append(create_cases(element_type, 2, [bindings, bindings]))
    #create wrong control cases:
    if control == 0:
        results['wrong'].append(create_cases(element_type, 1, [bindings]))
    elif control == 1:
        results['wrong'].append(create_cases(element_type, 2, [bindings, bindings]))
    elif control == 3:
        results['wrong'].append(None)
        results['wrong'].append(create_cases(element_type, 2, [bindings, bindings]))
    elif control == 4:
        results['wrong'].append(None)
    #create wrong content cases
    if bindings:
        if control == 1:
            results['wrong'].append(create_cases(element_type, 1))
        elif control == 2 or control == 4:
            results['wrong'].append([create_cases(element_type, 1)])
        elif control == 3:
            results['wrong'].append(create_cases(element_type, 1))
    return results

