var app = app || {};

app.host = "http://localhost:8000";
app.app_sample = ["Prefer \"PhantomJS\"",
"Visit \"https://www.google.com/\"",
"Input \"input\" \"#lst-ib\" \"fhir\"",
"Enter",
""
].join("\n");

app.server_sample = ["# Use print to get test result",
"# print string format",
"# [step name]:[description]:[success|failed]",
"",
"resources_names = ['Observation', 'Diagnostic Request', 'Sequence']",
"for name in resources_names:",
"    print \"%s:%s:%s\" % (name, 'Tested', 'success')"
].join("\n");