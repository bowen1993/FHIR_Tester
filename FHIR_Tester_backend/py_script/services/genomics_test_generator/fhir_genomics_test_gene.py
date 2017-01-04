from create_test_case import *
import csv
import json

def trans_csv_to_dict(csv_file):
    headers = []
    detail_dict = {}
    for index, row in enumerate(csv_file):
        if index == 0:
            headers = row
        else:
            element = row[0]
            detail_dict[element] = {}
            for subindex in range(1, len(headers)):
                detail_dict[element][headers[subindex]] = row[subindex]
    return detail_dict

def create_element_test_cases(detail_dict):
    test_cases = {}
    curr_parent = ''
    for element in detail_dict:
        non_prefix_element = remove_prefix(element)
        element_type = detail_dict[element]['Type']
        control = control_analyze(detail_dict[element]['Control'])
        binding_str = detail_dict[element]['Binding_Value']
        binding = None if len(binding_str) == 0 else json.loads(binding_str)
        if element_type.lower() == 'extension' or element_type.lower() == 'resource' or element_type.lower() == 'identifier':
            continue
        if element_type.lower() == 'backboneelement':
            test_cases[non_prefix_element] = 'backbone%d' % (1 if control == 4 or control == 2 else 0)
        else:
            if 'reference' in element_type.lower():
                binding = {'reference_type':detail_dict[element]['Reference']}
                element_type = 'reference'
            if '[x]' in non_prefix_element:
                non_prefix_element = non_prefix_element[:non_prefix_element.find('[')] + element_type.title()
            test_cases[non_prefix_element] = create_all_cases_for_type(element_type, control, binding)
    return test_cases

def combine_all_lists(lists):
    total = reduce(lambda x, y: x*y, map(len, [lists[key] for key in lists]))
    res_list = []
    for i in range(total):
        step = total
        tempItem = {}
        for key in lists:
            l = lists[key]
            step /= len(l)
            tempItem[key] = l[i/step % len(l)]
        res_list.append(tempItem)
    return res_list

def create_orthogonal_test_cases(element_test_cases):
    #get all right cases
    element_right_cases = {}
    element_name_lists = []
    for element in element_test_cases:
        element_name_lists.append(element)
        if 'backbone' in element_test_cases[element] or len(element_test_cases[element]['right']) == 0:
            continue
        element_right_cases[element] = element_test_cases[element]['right']
    #get all wrong test cases
    element_wrong_cases = {}
    for element in element_test_cases:
        if 'backbone' in element_test_cases[element] or len(element_test_cases[element]['wrong']) == 0:
            continue
        element_wrong_cases[element] = element_test_cases[element]['wrong']
    #generate orthogonal right test cases
    max_length = 0
    right_cases = []
    for key in element_right_cases:
        if len(element_right_cases[key]) > max_length:
            max_length = len(element_right_cases[key])
    for index in xrange(max_length):
        new_test_case = {}
        curr_parent = ''
        for key in element_right_cases:
            if is_sub(key):
                curr_parent = get_prefix(key)
            else:
                curr_parent = ''
            non_prefix_key = remove_prefix(key)
            if index < len(element_right_cases[key]):
                i = index
            else:
                i = len(element_right_cases[key])-1
            if len(curr_parent) > 0:
                #get parent control
                cont = element_test_cases[curr_parent][-1]
                if curr_parent in new_test_case:
                    if isinstance(new_test_case[curr_parent],list):
                        new_test_case[curr_parent][0][non_prefix_key] = element_right_cases[key][i]
                    else:
                        new_test_case[curr_parent][non_prefix_key] = element_right_cases[key][i]
                else:
                    if cont == '0':
                        new_test_case[curr_parent] = {
                            non_prefix_key:element_right_cases[key][i]
                        }
                    else:
                        new_test_case[curr_parent] = [{
                            non_prefix_key:element_right_cases[key][i]
                        }]
            else:
                try:
                    new_test_case[key] = element_right_cases[key][index]
                except:
                    new_test_case[key] = element_right_cases[key][len(element_right_cases[key])-1]
        right_cases.append(new_test_case)
    #generate orthogonal wrong test cases
    wrong_cases = []
    curr_parent = ''
    for key in element_wrong_cases:
        if is_sub(key):
            curr_parent = get_prefix(key)
        else:
            curr_parent = ''
        non_prefix_key = remove_prefix(key)
        cases = element_wrong_cases[key]
        for case in cases:
            wrong_case = {}
            if len(curr_parent) > 0:
                if curr_parent in wrong_case:
                    wrong_case[curr_parent][non_prefix_key] = case
                else:
                    wrong_case[curr_parent] = {
                        non_prefix_key:case
                    }
            else:
                wrong_case[key] = case
            for subkey in element_name_lists:
                if subkey == key:
                    continue
                if subkey not in element_right_cases:
                    continue
                if is_sub(subkey):
                    curr_parent = get_prefix(subkey)
                else:
                    curr_parent = ''
                non_prefix_subkey = remove_prefix(subkey)
                if len(curr_parent) > 0:
                    if curr_parent in wrong_case:
                        wrong_case[curr_parent][non_prefix_subkey] = element_right_cases[subkey]
                    else:
                        wrong_case[curr_parent] = {
                        non_prefix_subkey:element_right_cases[subkey]
                        }
                else:
                    wrong_case[subkey] = element_right_cases[subkey]
            #wrap wrong case
            case_with_info = {
                'case':wrong_case,
                'info': '%s is in error, should not be accepted' % key
            }
            wrong_cases.append(case_with_info)
    all_cases = right_cases + wrong_cases
    total_cases = len(all_cases)
    return  right_cases, wrong_cases
    

def create_all_test_cases(element_test_cases):
    #generate all right test cases
    element_right_cases = {}
    element_name_lists = []
    for element in element_test_cases:
        element_name_lists.append(element)
        if element_test_cases[element] == 'backbone' or len(element_test_cases[element]['right']) == 0:
            continue
        element_right_cases[element] = element_test_cases[element]['right']
    right_cases = combine_all_lists(element_right_cases)
    #generate all wrong test cases
    element_wrong_cases = {}
    for element in element_test_cases:
        if element_test_cases[element] == 'backbone' or len(element_test_cases[element]['wrong']) == 0:
            continue
        element_wrong_cases[element] = element_test_cases[element]['wrong']
    wrong_cases = []
    for key in element_wrong_cases:
        cases = element_wrong_cases[key]
        for case in cases:
            wrong_case = {}
            wrong_case[key] = case
            for subkey in element_name_lists:
                if subkey == key:
                    continue
                if subkey not in element_right_cases:
                    continue
                wrong_case[subkey] = element_right_cases[subkey]
            wrong_cases.append(wrong_case)
    all_cases = right_cases + wrong_cases
    total_cases = len(all_cases)
    return (right_cases, wrong_cases)


    
