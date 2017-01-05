var app = app || {};

app.host = "http://localhost:8000";
app.app_sample = ["Prefer \"PhantomJS\"",
"LoadSmartApp \"https://gallery.smarthealthit.org/gemomics/genetic-report-viewer\"",
"DoGenomicAuth",
""
].join("\n");

app.server_sample = ["# Use print to get test result",
"# print string format",
"# [step name]:[description]:[success|failed]",
"",
"from sandbox.resource_tester import *",
"#you can test a resource by calling function test_a_resource(resource_name, url, access_token=None)",
"",
"resource_name = 'Sequence'",
"url = 'http://fhirtest.uhn.ca/baseDstu2'",
"access_token=None",
"#setup",
"#id_dict = setup(url, access_token)",
"spec_filename = '%s%s.csv' % (spec_basepath, resource_name)",
"all_cases = create_all_test_case4type(spec_filename, resource_name)",
"#do the test",
"if not url.endswith('/'):",
"    url += '/'",
"#isSuccessful = iter_all_cases(resource_name, all_cases, '%s%s' % (url, resource_name),id_dict, access_token)",
"isSuccessful = True",
"print \"%s:All %s cases tested:%s\" % (resource_name, resource_name, 'success' if isSuccessful else 'fail')"
].join("\n");