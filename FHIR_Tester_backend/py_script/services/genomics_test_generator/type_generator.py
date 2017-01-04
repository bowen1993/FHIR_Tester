import random
import string
from datetime import datetime, date
import pytz

def random_string_generate(length):
    '''
    random string generator

    @param length: length of the string to be generated, required
    @type length: int
    @return random string
    @rtype str
    '''
    random.seed(1)
    return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(length))

def create_reference(reference_type=None):
    '''
    create a reference object

    @param reference_type: reference object type, required
    @type reference_type: str
    @return reference object
    @rtype:dict
    '''
    if reference_type == 'Resource':
        reference_type = 'Patient'
    reference_str = "%s/%s" % (reference_type if reference_type else random_string_generate(3), "1")
    return {'reference':reference_str}

def random_picker(pick_list):
    '''
    pick a element from a list randomly

    @param pick_list: list to pick element
    @type pick_list: list
    @return picked item
    @rtype: obj
    '''
    random.seed(1)
    low, high = 0, len(pick_list)-1
    return pick_list[random.randint(low, high)]

def create_string(suggested="", length=5):
    '''
    create a basic data type string

    @param suggested: user defined string, optional
    @type suggested: str
    @param length: user defined string length
    @type length: int
    @return string created
    @rtype: str
    '''
    if len(suggested) != 0:
        return suggested
    else:
        return random_string_generate(length)

def create_uri(suggested=""):
    '''
    create a random uri

    @param suggested: user defined uri domain, optional
    @type suggested: str
    @return generated uri
    @rtype str
    '''
    if len(suggested) != 0:
        return suggested
    else:
        uri = 'http://%s.com' % random_string_generate(5)
        return uri

def create_codeableconcept(code=None, system=None, start_with_code=False):
    '''
    create a codeable concept

    @param code: user defined code, optional
    @type code: str
    @param system: user defined system. optional
    @type system: str
    @return codeable concept
    @rtype dict
    '''
    #TODO: generate concept with multiply coding
    #TODO: add display
    if start_with_code:
        concept_dict = {
              "code": {
                "coding": [
                  {
                    "system": system if system else create_uri(),
                    "code": code if code else random_string_generate(5) + '1'
                  }
                ],
              }
            }
    else:
        concept_dict = {
                "coding": [
                  {
                    "system": system if system else create_uri(),
                    "code": code if code else random_string_generate(5) + '1'
                  }
                ],
              }
    return concept_dict


def create_quantity(customed_value=None, unit='oz', comparator='='):
    '''
    create quantity randomly, or user defined

    @param customed_value: user defined value, optional
    @type customed_value: doule or in
    @param unit: user defined unit, optional, default as oz
    @type unit: str
    @return quantity
    @rtype dict
    '''
    return {
        'value':customed_value if customed_value else create_decimal(),
        'unit':unit,
        'system':''
    }

def create_simplequantity():
    return create_quantity()

def create_integer(customed=None):
    random.seed(1)
    if customed == None:
        return random.randint(1,10)
    else:
        return customed

def create_code(code="",customed='code'):
    if customed != 'code':
        if len(code) != 0:
            return code
        else:
            return random_string_generate(5)
    else:
        if len(code) != 0:
            return {customed:code}
        else:
            return {customed:random_string_generate(5)}

def create_attachment(data=None,content_type="application/pdf", language="en"):
    return {
        'contentType':content_type,
        'language':language,
        'date':data,
        'title':random_string_generate(6)
    }

def create_instant():
    return create_datetime()

def create_decimal(customed=None):
    random.seed(1)
    if customed: 
        return customed
    else:
        return random.uniform(0,10)


def create_annotation():
    return {
        'author': create_reference('Patient'),
        'time':create_datetime(),
        'text':random_string_generate(15)
    }

def create_age(age_value=None):
    return create_quantity(age_value if age_value else random.randint(1,20), 'year')

def create_boolean():
    return random_picker([True, False])

def create_date():
    return date.today().isoformat()

def create_datetime():
    time_isoStr = datetime.now(pytz.timezone('US/Pacific')).isoformat('T')
    return time_isoStr

def create_narrative():
    return {
        'status': random_picker(['generated', 'extensions', 'additional', 'empty']),
        'div':'<p>%s</p>' % random_string_generate(20)
    }

def create_range(low=1.0, high=2.0):
    return {
        "low": create_quantity(low),
        "high": create_quantity(high)
    }
