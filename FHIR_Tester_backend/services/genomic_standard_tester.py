from genomics_test_generator import fhir_genomics_test_gene
from request_sender import *
from services.create_resource import *
import random
import json
import traceback
import requests

from django.db import transaction
from home.models import task, task_steps, step_detail

resource_list = ['DiagnosticReport', 'FamilyMemberHistory', 'Sequence', 'DiagnosticRequest', 'Observation']
spec_basepath = 'resources/spec/'
resource_basepath = 'resources/json/'
ga4gh_server = 'http://ideaworld.org:6060/'

gene_variant_extension = [
    {
      "url": "http://hl7.org/fhir/StructureDefinition/observation-geneticsDNASequenceVariant",
      "valueString": "NG_007726.3:g.146252T>G"
    },
    {
      "url": "http://hl7.org/fhir/StructureDefinition/observation-geneticsGene",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "http://www.genenames.org",
            "code": "3236",
            "display": "EGFR"
          }
        ]
      }
    }
]

genetic_observation_extension = [
    {
      "url": "http://hl7.org/fhir/StructureDefinition/observation-geneticsDNASequenceVariant",
      "valueString": "NG_007726.3:g.146252T>G"
    },
    {
      "url": "http://hl7.org/fhir/StructureDefinition/observation-geneticsGene",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "http://www.genenames.org",
            "code": "3236",
            "display": "EGFR"
          }
        ]
      }
    },
    {
      "url": "http://hl7.org/fhir/StructureDefinition/observation-geneticsDNARegionName",
      "valueString": "Exon 21"
    },
    {
      "url": "http://hl7.org/fhir/StructureDefinition/observation-geneticsGenomicSourceClass",
      "valueCodeableConcept": {
        "coding": [
          {
            "system": "http://hl7.org/fhir/LOINC-48002-0-answerlist",
            "code": "LA6684-0",
            "display": "somatic"
          }
        ]
      }
    }
]

class genomic_standard_tester(Object):
    def __init__(self, task_id="",url="",access_token=None, resources=["0","1","2","3","4","5"]):
        self.task_id = task_id
        self.url = url
        self.access_token = access_token
        self.resources = resources

    