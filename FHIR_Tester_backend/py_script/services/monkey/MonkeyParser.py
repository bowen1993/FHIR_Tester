from ply import *
import MonkeyLex

tokens = MonkeyLex.tokens

def p_program(p):
    '''program  : program compound_action actions
                | compound_action actions
                | program actions
                | actions 
    '''
    if len(p) == 4:
        p[0] = p[1]
        if not p[0]: p[0] = []
        p[0].append(p[2])
        if p[3]:
            for act_obj in p[3]:
                if act_obj:
                    p[0].append(act_obj)
    elif len(p) == 3:
        if isinstance(p[1], dict):
            p[0] = p[1]
            if not p[0]: p[0] = []
            if p[2]:
                for act_obj in p[2]:
                    p[0].append(act_obj)
        else:
            p[0] = []
            p[0].append(p[1])
            if p[2] and len(p[2]) > 0:
                for act_obj in p[2]:
                    p[0].append(act_obj)
    elif len(p) == 2 and p[1]:
        p[0] = []
        for act_obj in p[1]:
            p[0].append(act_obj)

def p_program_error(p):
    '''program : error '''
    p[0] = None
    p.parser.error = 1

def p_actions(p):
    '''actions   : actions action
                | action
    '''
    if len(p) == 2:
        if not p[0]:
            p[0] = []
        p[0].append(p[1])
    elif len(p) == 3:
        p[0] = p[1]
        if not p[0]:
            p[0] = []
        p[0].append(p[2])

def p_action_auth(p):
    '''action   : Auth STRING STRING NEWLINE
    '''
    action_dict = {
        'move': p[1],
        'type': 'auth',
        'username': p[2],
        'password': p[3]
    }
    p[0] = action_dict

def p_action_single(p):
    '''action   : movement NEWLINE
    '''
    action_dict = {
        'move': p[1][1],
        'type': 'single_action',
        'is_wait': True if len(p) == 3 else p[2]
    }
    p[0] = action_dict

def p_action_target(p):
    '''action   : movement target STRING BOOL NEWLINE
                | movement target STRING NEWLINE
                | movement target BOOL NEWLINE
                | movement target NEWLINE
    '''
    if not p[1][0]:
        print("%s At Line %d", (p[1][1], p.lineno(1)))
        p[0] = None
        p.parser.error = 1
    else:
        action_dict = {}
        if len(p) == 6:
            action_dict = {
                'move':p[1][1],
                'target': p[2],
                'vaule': p[3],
                'is_wait': p[4],
                'type': 'action_target'
            }
        elif len(p) == 5:
            action_dict = {
                'move':p[1][1],
                'target': p[2],
                'type': 'action_target',
                'is_wait' : True
            }
            if isinstance(p[3], str):
                action_dict['value'] = p[3]
                action_dict['is_wait'] = True
            elif isinstance(p[3], bool):
                action_dict['is_wait'] = p[3]
        elif len(p) == 4:
            action_dict = {
                'move':p[1][1],
                'target': p[2],
                'type': 'action_target',
                'is_wait' : True
            }
        p[0] =  action_dict

def p_action_command(p):
    '''action  : movement STRING NEWLINE
    '''
    if not p[1][0]:
        print("%s At Line %d", (p[1][1], p.lineno(1)))
        p[0] = None
        p.parser.error = 1
    else:
        action_dict = {
            'move': p[1][1],
            'value':p[2],
            'type':'action_command',
            'is_wait': True
        }
        p[0] = action_dict


def p_action_judge(p):
    '''action   : Judge target STRING NEWLINE
                | Judge target Not STRING NEWLINE
    '''
    action_dict = {
        'move':'Judge',
        'type': 'action_judge',
        'target': p[2],
        'expect': p[3] if len(p) == 5 else p[4],
        'is_equal': True if len(p) == 5 else False,
        'is_wait': True
    }
    p[0] =  action_dict

def p_action_empty(p):
    '''action  : NEWLINE
    '''
    p[0] = None

def p_action_bad(p):
    '''action   : error NEWLINE
    '''
    print("Wrong action at line %d" % p.lineno(0))
    p[0] = None
    p.parser.error = 1

def p_movement(p):
    '''movement : Prefer
                | Patient
                | Visit
                | Blind
                | Click
                | Input
                | Choose
                | Back
                | Forward
                | Accept
                | Auth
                | Dismiss
                | Press
                | Switch
                | Enter
                | LoadSmartApp
                | DoGenomicAuth
    '''
    p[0] = (True, p[1])

def p_movement_bad(p):
    '''movement : error
    '''
    p[0] = (False, "Wrong movement setting")
    p.parser.error = 1

def p_compound_action(p):
    '''compound_action  : repeat_block
                        | task_block
    '''
    p[0] = p[1]

def p_repeat_block(p):
    '''repeat_block : Repeat NUMBER NEWLINE actions End NEWLINE
                    | Repeat NUMBER NEWLINE compound_action End NEWLINE
    '''
    block_dict = {
        'type':'repeat',
        'content':p[4],
        'times': p[2]
    }
    p[0] = block_dict

def p_task_block(p):
    '''task_block   : Task ID NEWLINE actions End
                    | Task ID NEWLINE compound_action End
    '''
    block_dict = {
        'type': 'task',
        'content': p[4],
        'name': p[2]
    }
    p[0] = block_dict

def p_target(p):
    '''target   : STRING STRING
                | STRING
    '''
    if len(p) == 3:
        p[0] = p[1] + p[2]
    elif len(p) == 2:
        p[0] = p[1]

MParser = yacc.yacc()

def parse(data,debug=0):
    MParser.error = 0
    p = MParser.parse(data,debug=debug)
    if MParser.error: return None
    return p