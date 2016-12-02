from ply import *

keywords = (
    'Prefer', 'Patient', 'Visit', 'Blind', 'Click', 'Input', 'Choose',
    'Back', 'Forward', 'Accept', 'Auth', 'Dismiss', 'Press', 'Switch',
    'Repeat', 'Task', 'End', 'Judge', 'Empty', 'Not', 'True', 'False', 'Page', 'Enter','LoadSmartApp'
)

tokens = keywords + (
    'ID', 'NUMBER', 'STRING', 'BOOL', 'EQUAL', 'NEWLINE'
)

t_ignore = '\t'

def t_ID(t):
    r'[a-zA-Z][a-zA-Z0-9]*'
    if t.value in keywords:
        if t.value == 'True' or t.value == 'False':
            t.type = 'BOOL'
            t.value = True if t.value == 'True' else False
        else:
            t.type = t.value
    return t

def t_NUMBER(t):
    r"""(\d+(\.\d*)?|\.\d+)([eE][-+]? \d+)?"""
    t.value = float(t.value)
    return t

def t_NEWLINE(t):
    r'\n'
    t.lexer.lineno += 1
    return t

def t_STRING(t):
    r'\".*?\"'
    t.value = t.value.replace("\"", '')
    return t
# t_STRING = r'\".*?\"'
def t_BOOL(t):
    r'(True)|(False)'
    t.value = True if t.value == 'True' else False
    return t

t_EQUAL = r'='

def t_error(t):
    print("Illegal character %s detected" % t.value[0])
    t.lexer.skip(1)

lex.lex(debug=1)