import names
import json
from vcf import VCFReader
import random

def make_patients(index):
    gender = 'female' if random.random() < 0.5 else 'male'
    first_name = names.get_first_name(gender=gender)
    last_name = names.get_last_name()
    full_name = '%s %s'% (first_name, last_name)
    data = {
        'resourceType': 'Patient',
        'text': {
            'status': 'generated',
            'div': "<div><p>%s</p></div>"% full_name
        },
        'name': [{'text': full_name}],
        'gender': gender
    }
    print json.dumps(data)
    res_file = open('Patient_%d.json' % index, 'w')
    res_file.write(json.dumps(data))
    res_file.close()

def make_practitioner(index):
    first_name = names.get_first_name()
    last_name = names.get_last_name()
    full_name = '%s %s'% (first_name, last_name)
    tmpl = {
        "resourceType": "Practitioner",
        "text": {
            "status": "generated",
            "div": "<div>\n      <p>Dr Adam Careful is a Referring Practitioner for Acme Hospital from 1-Jan 2012 to 31-Mar\n        2012</p>\n    </div>"
        },
        "name": [full_name]
    }
    pstr = json.dumps(tmpl)
    print pstr
    res_file = open('Practitioner_%d.json' % index, 'w')
    res_file.write(pstr)
    res_file.close()

def make_provenance(patient_id,index):
    tmpl = {
        "resourceType": "Provenance",
        "text": {
            "status": "generated",
            "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">procedure record authored on 27-June 2015 by Harold Hippocrates, MD Content extracted from Referral received 26-June</div>"
        },
        "target": [
            {
            "reference": ""
            }
        ],
        "period": {
            "start": "2015-06-27"
        },
        "recorded": "2015-06-27T08:39:24+10:00",
        "reason": [
            {
            "system": "http://snomed.info/sct",
            "code": "3457005",
            "display": "Referral"
            }
        ],
        "policy": [
            "http://acme.com/fhir/Consent/25"
        ],
        "agent": [
            {
            "role": {
                "system": "http://hl7.org/fhir/provenance-participant-role",
                "code": "author"
            },
            
            "userId": {
                "system": "http://acme.com/fhir/users/sso",
                "value": "hhd"
            },
            "relatedAgent": [
                {
                "type": {
                    "text": "used"
                },
                "target": "#a1"
                }
            ]
            },
            {
            "id": "a1",
            "role": {
                "system": "http://hl7.org/fhir/v3/ParticipationType",
                "code": "DEV"
            }
            }
        ]
    }
    tmpl['target'][0]['reference']='Patient/%s'%patient_id
    pstr = json.dumps(tmpl)
    print pstr
    res_file = open('Provenance_%d.json' % index, 'w')
    res_file.write(pstr)
    res_file.close()

def make_device(index):
    tmpl = {
        "resourceType": "Device",
        "text": {
            "status": "generated",
            "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative with Details</b></p><p><b>id</b>: example</p><p><b>identifier</b>: 345675, Serial Number = AMID-342135-8464</p><p><b>status</b>: available</p><p><b>type</b>: ECG <span>(Details : {SNOMED CT code '86184003' = 'Electrocardiographic monitor and recorder, device (physical object)', given as 'Electrocardiographic monitor and recorder'})</span></p><p><b>lotNumber</b>: 43453424</p><p><b>manufacturer</b>: Acme Devices, Inc</p><p><b>model</b>: AB 45-J</p><p><b>contact</b>: ph: ext 4352</p><p><b>note</b>: QA Checked</p></div>"
        },
        "identifier": [
            {
            "system": "http://goodcare.org/devices/id",
            "value": "345675"
            },
            {
            "type": {
                "coding": [
                {
                    "system": "http://hl7.org/fhir/identifier-type",
                    "code": "SNO"
                }
                ],
                "text": "Serial Number"
            },
            "value": "AMID-342135-8464"
            }
        ],
        "status": "available",
        "type": {
            "coding": [
            {
                "system": "http://snomed.info/sct",
                "code": "86184003",
                "display": "Electrocardiographic monitor and recorder"
            }
            ],
            "text": "ECG"
        },
        "lotNumber": "43453424",
        "manufacturer": "Acme Devices, Inc",
        "model": "AB 45-J",
        "contact": [
            {
            "system": "phone",
            "value": "ext 4352"
            }
        ]
    }
    pstr = json.dumps(tmpl)
    print pstr
    res_file = open('Device_%d.json' % index, 'w')
    res_file.write(pstr)
    res_file.close()
    
def make_encounter(index):
    tmpl = {
    "resourceType": "Encounter",
    "text": {
        "status": "generated",
        "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">Encounter with patient @example</div>"
    },
    "status": "in-progress",
    "class": {
        "system": "http://hl7.org/fhir/v3/ActCode",
        "code": "IMP",
        "display": "inpatient encounter"
    }
    }
    pstr = json.dumps(tmpl)
    print pstr
    res_file = open('Encoutner_%d.json' % index, 'w')
    res_file.write(pstr)
    res_file.close()

def make_specimen(patient_id,index):
    tmpl = {
    "resourceType": "Specimen",
    "text": {
        "status": "generated",
        "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative with Details</b></p><p><b>id</b>: 101</p><p><b>contained</b>: </p><p><b>identifier</b>: 23234352356</p><p><b>accessionIdentifier</b>: X352356</p><p><b>status</b>: available</p><p><b>type</b>: Venous blood specimen <span>(Details : {SNOMED CT code '122555007' = 'Venous blood specimen (specimen)', given as 'Venous blood specimen'})</span></p><p><b>subject</b>: <a>Peter Patient</a></p><p><b>receivedTime</b>: Mar 4, 2011 7:03:00 AM</p><p><b>request</b>: <a>DiagnosticRequest/example</a></p><h3>Collections</h3><table><tr><td>-</td><td><b>Collector</b></td><td><b>Collected[x]</b></td><td><b>Quantity</b></td><td><b>Method</b></td></tr><tr><td>*</td><td><a>Practitioner/example</a></td><td>May 30, 2011 6:15:00 AM</td><td>6 mL</td><td>Line, Venous <span>(Details : {http://hl7.org/fhir/v2/0488 code 'LNV' = 'Line, Venous)</span></td></tr></table><h3>Containers</h3><table><tr><td>-</td><td><b>Identifier</b></td><td><b>Description</b></td><td><b>Type</b></td><td><b>Capacity</b></td><td><b>SpecimenQuantity</b></td><td><b>Additive[x]</b></td></tr><tr><td>*</td><td>48736-15394-75465</td><td>Green Gel tube</td><td>Vacutainer <span>(Details )</span></td><td>10 mL</td><td>6 mL</td><td>id: hep; Lithium/Li Heparin <span>(Details : {http://hl7.org/fhir/v3/EntityCode code 'HEPL' = 'Lithium/Li Heparin)</span></td></tr></table><p><b>note</b>: Specimen is grossly lipemic</p></div>"
    },
    "identifier": [
        {
        "system": "http://ehr.acme.org/identifiers/collections",
        "value": "23234352356"
        }
    ],
    "accessionIdentifier": {
        "system": "http://lab.acme.org/specimens/2011",
        "value": "X352356"
    },
    "status": "available",
    "type": {
        "coding": [
        {
            "system": "http://snomed.info/sct",
            "code": "122555007",
            "display": "Venous blood specimen"
        }
        ]
    },
    "subject": {
        "reference": ""
    },
    "receivedTime": "2011-03-04T07:03:00Z"
    }
    tmpl['subject']['reference'] = 'Patient/%s'%patient_id
    pstr = json.dumps(tmpl)
    print pstr
    res_file = open('Specimen_%d.json' % index, 'w')
    res_file.write(pstr)
    res_file.close()

def make_observation(index):
    tmpl = {
    "resourceType": "Observation",
    "text": {
        "status": "generated",
        "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative with Details</b></p><p><b>id</b>: example-genetics-2</p><p><b>status</b>: final</p><p><b>code</b>: Genetic analysis master panel <span>(Details : {LOINC code '55233-1' = 'Genetic analysis master panel - Blood or Tissue by Molecular genetics method', given as 'Genetic analysis master panel'})</span></p><p><b>subject</b>: <a>Molecular Lab Patient ID: HOSP-23456</a></p><p><b>issued</b>: Apr 3, 2013 3:30:10 PM</p><p><b>performer</b>: <a>Molecular Diagnostics Laboratory</a></p><p><b>value</b>: Positive <span>(Details : {SNOMED CT code '10828004' = 'Positive (qualifier value)', given as 'Positive'})</span></p><h3>Relateds</h3><table><tr><td>-</td><td><b>Type</b></td><td><b>Target</b></td></tr><tr><td>*</td><td>derived-from</td><td><a>Observation/example-genetics-1</a></td></tr></table><blockquote><p><b>component</b></p><p><b>code</b>: Genetic disease assessed <span>(Details : {LOINC code '51967-8' = 'Genetic disease assessed [Identifier] in Blood or Tissue by Molecular genetics method', given as 'Genetic disease assessed'})</span></p><p><b>value</b>: Lung cancer <span>(Details : {SNOMED CT code '363358000' = 'Malignant tumor of lung (disorder)', given as 'Malignant tumor of lung (disorder)'})</span></p></blockquote><blockquote><p><b>component</b></p><p><b>code</b>: Genetic disease sequence variation interpretation <span>(Details : {LOINC code '53037-8' = 'Genetic disease sequence variation interpretation [interpretation] in Blood or Tissue by Molecular genetics method', given as 'Genetic disease sequence variation interpretation'})</span></p><p><b>value</b>: Pathogenic <span>(Details : {[not stated] code 'LA6669-1' = 'LA6669-1', given as 'Pathogenic'})</span></p></blockquote></div>"
    },
    "status": "final",
    "code": {
        "coding": [
        {
            "system": "http://loinc.org",
            "code": "55233-1",
            "display": "Genetic analysis master panel"
        }
        ]
    },
    "issued": "2013-04-03T15:30:10+01:00",
    "valueCodeableConcept": {
        "coding": [
        {
            "system": "http://snomed.info/sct",
            "code": "10828004",
            "display": "Positive"
        }
        ]
    }
    }
    pstr = json.dumps(tmpl)
    print pstr
    res_file = open('Observation_%d.json' % index, 'w')
    res_file.write(pstr)
    res_file.close()

def make_sequence():
    tmpl = {
        "resourceType": "Sequence",
        "text": {
        "status": "generated",
        "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative with Details</b></p><p><b>id</b>: example</p><p><b>type</b>: DNA</p><p><b>coordinateSystem</b>: 0</p><p><b>patient</b>: <a>Patient/example</a></p><h3>ReferenceSeqs</h3><table><tr><td>-</td><td><b>ReferenceSeqId</b></td><td><b>Strand</b></td><td><b>WindowStart</b></td><td><b>WindowEnd</b></td></tr><tr><td>*</td><td>NC_000007.14 <span>(Details : {http://www.ncbi.nlm.nih.gov/nuccore code 'NC_000007.14' = 'NC_000007.14)</span></td><td>1</td><td>55227970</td><td>55227980</td></tr></table><h3>Variants</h3><table><tr><td>-</td><td><b>Start</b></td><td><b>End</b></td><td><b>ObservedAllele</b></td><td><b>ReferenceAllele</b></td></tr><tr><td>*</td><td>55227976</td><td>55227977</td><td>T</td><td>A</td></tr></table><h3>Repositories</h3><table><tr><td>-</td><td><b>Url</b></td><td><b>Name</b></td><td><b>VariantId</b></td></tr><tr><td>*</td><td><a>https://www.googleapis.com/genomics/v1beta2</a></td><td>ga4gh</td><td>A1A2</td></tr></table></div>"
        },
        "type": "DNA",
        "coordinateSystem": 0,
        "referenceSeq": {
        "referenceSeqId": {
            "coding": [
            {
                "system": "http://www.ncbi.nlm.nih.gov/nuccore",
                "code": "NC_000007.14"
            }
            ]
        },
        "strand": 1,
        "windowStart": 55227970,
        "windowEnd": 55227980
        },
        "variant": [
        {
            "start": 55227976,
            "end": 55227977,
            "observedAllele": "T",
            "referenceAllele": "A"
        }
        ]
    }
    pstr = json.dumps(tmpl)
    print pstr
    res_file = open('Sequence.json', 'w')
    res_file.write(pstr)
    res_file.close()

def make_ImagingStudy(patient_id,index):
    tmpl = {
        "resourceType": "ImagingStudy",
        "text": {
        "status": "generated",
        "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">Image 1 from Series 3: CT Images on Patient MINT (MINT1234) taken at 1-Jan 2011 01:20 AM</div>"
        },
        "uid": "urn:oid:2.16.124.113543.6003.1154777499.30246.19789.3503430045",
        "patient": {
            "reference": ""
        },
        "started": "2011-01-01T11:01:20+03:00",
        "numberOfSeries": 1,
        "numberOfInstances": 1,
    }
    tmpl['patient']['reference'] = 'Patient/%s'%patient_id
    pstr = json.dumps(tmpl)
    print pstr
    res_file = open('ImagingStudy_%d.json'%index, 'w')
    res_file.write(pstr)
    res_file.close()

def make_media():
    tmpl = {
        "resourceType": "Media",
        "text": {
            "status": "generated",
            "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">Diagram for Patient Henry Levin (MRN 12345):<br/><img src=\"#11\" alt=\"diagram\"/></div>"
        },
        "type": "photo",
        "subtype": {
            "coding": [
            {
                "system": "http://hl7.org/fhir/media-method",
                "code": "diagram"
            }
            ]
        },
        "deviceName": "Acme Camera",
        "height": 145,
        "width": 126,
        "frames": 1,
        "content": {
            "id": "a1",
            "contentType": "image/gif",
            "data": "R0lGODlhfgCRAPcAAAAAAIAAAACAAICAAAAAgIAA    gACAgICAgMDAwP8AAAD/AP//AAAA//8A/wD/////    /wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA    AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA    AAAAAAAAAAAAAAAAAAAAAAAAMwAAZgAAmQAAzAAA    /wAzAAAzMwAzZgAzmQAzzAAz/wBmAABmMwBmZgBm    mQBmzABm/wCZAACZMwCZZgCZmQCZzACZ/wDMAADM    MwDMZgDMmQDMzADM/wD/AAD/MwD/ZgD/mQD/zAD/    /zMAADMAMzMAZjMAmTMAzDMA/zMzADMzMzMzZjMz    mTMzzDMz/zNmADNmMzNmZjNmmTNmzDNm/zOZADOZ    MzOZZjOZmTOZzDOZ/zPMADPMMzPMZjPMmTPMzDPM    /zP/ADP/MzP/ZjP/mTP/zDP//2YAAGYAM2YAZmYA    mWYAzGYA/2YzAGYzM2YzZmYzmWYzzGYz/2ZmAGZm    M2ZmZmZmmWZmzGZm/2aZAGaZM2aZZmaZmWaZzGaZ    /2bMAGbMM2bMZmbMmWbMzGbM/2b/AGb/M2b/Zmb/    mWb/zGb//5kAAJkAM5kAZpkAmZkAzJkA/5kzAJkz    M5kzZpkzmZkzzJkz/5lmAJlmM5lmZplmmZlmzJlm    /5mZAJmZM5mZZpmZmZmZzJmZ/5nMAJnMM5nMZpnM    mZnMzJnM/5n/AJn/M5n/Zpn/mZn/zJn//8wAAMwA    M8wAZswAmcwAzMwA/8wzAMwzM8wzZswzmcwzzMwz    /8xmAMxmM8xmZsxmmcxmzMxm/8yZAMyZM8yZZsyZ    mcyZzMyZ/8zMAMzMM8zMZszMmczMzMzM/8z/AMz/    M8z/Zsz/mcz/zMz///8AAP8AM/8AZv8Amf8AzP8A    //8zAP8zM/8zZv8zmf8zzP8z//9mAP9mM/9mZv9m    mf9mzP9m//+ZAP+ZM/+ZZv+Zmf+ZzP+Z///MAP/M    M//MZv/Mmf/MzP/M////AP//M///Zv//mf//zP//    /yH5BAEAABAALAAAAAB+AJEAQAj/AP8JHEiwoMGD    CBMqXMiwocOHECNKnEixosWLGFHAckaN2jRnsKZh    HEmy5EMU0+L5EseNG654KEzKnGkShbN4uFq2xOWR    ps+fE5nEy6Wz5a+XQJMqTeisGdGiLuNRi7m0qlJn    06iF7LhxKoqvX2FpnRYSq1eBX62qRYhCKzWzZDeK    3bqR7NSsb99uddZ2r1ZnINuanbrWp82tb8ly/Bjy    a1aOKOu+5ZgXZFa7sARzBMl5a9rCJDl29ejxMuDK    eb3mJYsSa93GIOW61QgWbEjQGStbrru7o2K3dkXj    BUz242WUbj0u9vj1b2KquCn27Rq7I1+9nBkn7gyS    K/HBnFd3/y8bUizf6CM76s0qduxp0pvN23UrOnF7    zB7nWiaMXuZhvGJNoxhjpr3G3WMfJfdbgtD1p1Rb    xgkHX3uUbeYbdli5dp6DHHbo4YcghijiiCSWeJJG    rJloIkoqPeXLNA2q+GFHm+yUSzzxiCQjiG3hVFQu    N+74IQry4JSTTjfCImSHyE1TyS9I+iJPZkv21ySE    +bE31VTjhZfZfhm2V+VJXLH3WH70MfZVeKfF9Z1i    nv3mXldjEiTYmX9tpVhkXrW1JpfX6bVdnosh19xG    INVpk3JydafYZjC6RhqMNlHa11u0aQbjl/mVJaB1    McrY16eSSeYle2AmqGp5wIl1KVxj+f8WIDV1/iOY    Vote5lt4eZUn6WsI+kZgp6iVxV+tAs064aqUebdr    aW55GqZ2AiIWKrIHQahfo3bBeaZ5zq1q17XYMoQl    eQt+Jxt56jXrarnwxivvvPTWa++9TJYlGrn4+kdN    PJv4kksz92zY709ExqPJkbncw+/BI9mEDy4Mx+MM    xD/9+xQ3m+RIK8Yz2STPkS11s8nFIMvEhDw1FoVL    xynLdI9KR+bUMMoxR+yML1BxIyWMOY+0kTxQuizV    w0E3hOJjBTe9UYO1fZZ0Qlga59hYvgLX3W7GWo20    vLWV5uqjlHZUaVcDbukuZVTe29poqNYnZ2ZzrdbV    0hRmdZh9dX3/raKv5MknG19YVojmVPIJmtlwhBpX    bq4V6trd1VhV6t5jfM6XWWVzaRmZ3yO+3WaAi3XG    FZfP2vRnYogLp+tec4Ee4qLZ3dfV3XXpHanZMHJV    d6WsucprXJiOyaZ+iaH60aJ1JxirRoCF5Wdmfnql    J9uUVdma1m7CvTe74mHWLSyNgft6nmaDNSZy5o1m    HvPWadW+aN9luVxglpnVeXF6Kxr/88MhX3wcJZsB    uS81uDpc+5KDM0VBr3SlAQx1LBSSy1AHT2iSS1u2    E6DYwUtbGTQOacj3mPGg6TeSEZBrWAUnyMzrbVk6    XVyKsxgCwW0/62GMhVKErw12S1D5S0185RQnn8XQ    xYUx45NyNOe87gCRPubZj+xeaB+smIl+yllirCho    xKmhxExoK1Cv0BSftAVmamhMoxrXyMY2uvGNcIyj    HOeoxkXBh44OOZdn8Ggu+DiPjwtJ2CZyUomCTRGO    KJFHLljiEnkc8o0Sy0U3WpILoAGSLf9qmc86ckmE    /MtHOfEFVjp5EGfc40jieAlgSFmQL27sF/GQx8dY    iRaP8EwnL9ERLW1lS5L5whfxyMcubaWworVEHIX0    xzBRcI9NMBJJ9xgmMTW5E19QQ5m0tAlOjOkzeeiS    lcwcJFSAeSxSomRjuDT/2y6ncQ9fkMwozMkmVhRW    lFTGk5T5sAlgaCawjjWjnJcEYoYWRJU/CUdqbQSX    bNYEGRQZjj630qAXO7MmRJ3pOq65DOOiBaqghaVy    a4sUcrKYn+ugay+PXFJzgiOesGWISx3sFfRoaEHC    qY9ePmzUpCoTnN5JyobF8lx9zJJSEZlqWNK6D0ar    taDWsY4zOV2NVj5olq2VVIvCQ1GsjKURBSnnbCJk    FbzihxdSqYc1MAyhZZBDPwZ1sKygKiqTHsOqPGFO    L8JrX7cgxBmiYk2LagKo9uQ3LKv2zjGcMlbsVLUv    I2YRUf+Z5fq2GqzRqO04Z2POlyo4m7KGB3oXsmSd    /2Llps7Mh6mVK84FtQW9qllnccLJkFythBgUyo2F    AlzTgMIyqECVDkZltSgSB6unZ8Vwc9jZHKUIJ8Ll    8YkvkmLUa3koJPaFdoGeK2Ln9KI6S4GFVMsDV31e    M1vQqPZT+uMpcJYY2/V89y9+0tuoKuqp8mhvfKnx    7NNI95fiCIpx1Nmchrj1VbaWtzAOdSLr6MLX+5VH    Px+BVIVQdLuXKk8v2pMg69wzFodez0x/Fa+37tQ4    CcbnwAge6Icbg9Ww6gpAALLrXer20mKhuDDGoWlg    /Aveq8InizQsjwq7GkQEEVVRsWHQYYIYQ+cFK00G    4o1webxWZEEIsVAEznmH6N1Y4eiUNJaLaRex9UVf    wWlSJCRhr+AiZElZsYZoi5xg12eqp3buNEJm3LRQ    BcTeSZUx8/pLdk53w9p6CYKE/p+J83NjJuUPeemq    71bbqrjTkTEvjfaQDyFFnXbJr1lshqIKnaja4uHr    tWEa4beqRZpJpXcvy3kaxhxD6U/NqaQ0xCr6jJhp    FUlYPVl01HrsI8JYPSdpoCXhEG2YUVzrqT2mzpkS    KVRAG955u3SJdhITZ766KosyNjQOnZAt6F3d7oQJ    +inaJNPrHUXt3fCOt7ylSe962/ve+M63vvkYEAA7",
            "creation": "2009-09-03"
        }
    }
    pstr = json.dumps(tmpl)
    print pstr
    res_file = open('Media.json', 'w')
    res_file.write(pstr)
    res_file.close()
    
if __name__ == '__main__':
    for index in range(5):
        make_patients(index)
        make_practitioner(index)
        make_provenance('1',index)
        make_ImagingStudy('1',index)
        make_observation(index)
        make_specimen('1',index)
        make_encounter(index)
        make_device(index)
    make_sequence()
    make_media()