let config = require('../config')

let um = require('unique-model');
let Types = um.Types;
let Text = Types.Text;
let Integer = Types.Integer;
let Double = Types.Double;
let Bool = Types.Bool;
let DateTime = Types.DateTime;
let UObject = Types.UObject;
let UObjectArray = Types.UObjectArray;

um.enablePersist();
let session = um.createSession(config.database);

let User = um.model.createModel('User', {
    username: Text(),
    password: Text(),
    user_level: Integer()
});

let FHIRServer = um.model.createModel('FHIRServer', {
    name: Text(),
    url: Text(),
    access_token: Text(),
    is_delete: Bool(),
    is_deletable: Bool()
});

let Level = um.model.createModel('Level', {
    name: Text()
});

let Resource = um.model.createModel('Resource', {
    name: Text()
});

let Case = um.model.createModel('Case', {
    code_status: Text(),
    name: Text(),
    description: Text(),
    http_request: Text(),
    http_response: Text(),
    http_response_status: Integer(),
    resource: Text()
});

let Step = um.model.createModel('Step', {
    name: Text(),
    code_status: Text(),
    description: Text(),
    additional_filepath: Text(),
    cases: UObjectArray({
        type: 'Case'
    })
});

let Task = um.model.createModel('Task', {
    target_server: UObject({
        type: 'Server'
    }),
    language: Text(),
    task_type: Text(),
    code_status: Text(),
    code: Text(),
    create_time : DateTime(),
    user: UObject({
        type: 'User'
    }),
    steps: UObjectArray({
        type: 'Step'
    })
});

let Result = um.model.createModel('Result', {
    task: UObject({
        type: 'Task'
    }),
    code_status: Text(),
    level: UObjectArray({
        type: 'Level'
    })
});

let UserDao = session.getDao(User);
let FHIRServerDao = session.getDao(FHIRServer);
let ResourceDao = session.getDao(Resource);
let LevelDao = session.getDao(Level);
let CaseDao = session.getDao(Case);
let StepDao = session.getDao(Step);
let TaskDao = session.getDao(Task);
let ResultDao = session.getDao(Result);

module.exports = {
    User,
    FHIRServer,
    Resource,
    Level,
    Case,
    Step,
    Task,
    Result,
    UserDao,
    FHIRServerDao,
    ResourceDao,
    LevelDao,
    CaseDao,
    StepDao,
    TaskDao,
    ResultDao
}