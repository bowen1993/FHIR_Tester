let config = require('../config');
let models = require('../models');
let Resource = models.Resource;
let ResourceDao = models.ResourceDao;
let Level = models.Level;
let levelDao = models.LevelDao;
let FHIRServer = models.FHIRServer;
let FHIRServerDao = models.FHIRServerDao;
let Task = models.Task;
let TaskDao = models.TaskDao;
let Step = models.Step;
let StepDao = models.StepDao;

var test_type = config.task;

var get_value = function(step){
    if (step.description.toLowerCase() == 'success'){
        return 0; 
    }
    return 1;
}

var find_resource = function(name, target){
    for (var i = 0; i < target.length; i++) {
        if (target[i]['name'] == name) {
            return i;
        }
    }
    return -1;
}

var get_resources = function(){
    let resource_list = ResourceDao.find({});
    var resources = [];
    resource_list.forEach(resource_obj => {
        resource_list.push({'name': resource_obj.name})        
    });
    return resources;
}

var get_levels(){
    let level_list = levelDao.find({});
    var levels = [];
    level_list.forEach(level_obj => {
        levels.push({'name': level_obj.name})        
    });
    return levels;
}

var form_matrix = function(ttype,ttime){
    datas = {
        'servers':[],
        'resources':[],
        'links':[]
    }
    if (ttype == test_type['FHIR_TEST']){
        datas['resources'] = get_resources();
    }
    else if (ttype == test_type['STANDARD_TEST']) {
        datas['resources'] = get_levels()
    }
    else{
        return datas;
    }
    var datetime_obj = undefined;
    if (ttime && ttime.length > 0){
        datetime_obj = ttime.toUTCString();
    }
    let server_list = FHIRServerDao.find({
        is_delete:false
    }); 
    var server_index = 0;
    server_list.forEach(obj => {
        datas['servers'].push({'name':obj.server_name});
        var task_id = undefined;
        if (datetime_obj){
            let task_list = Task.find({
                task_type:ttype,
                target_server:server_obj,
                create_time:datetime_obj
            })
            if (task_list.length != 0){
                task_id = task_list[0];
            }
            else{
                server_index += 1;
                continue;
            }
        }
        else{
            let task_list = TaskDao.find({
                task_type:ttype,
                target_server:server_obj
            });
            if (task_list.length != 0){
                task_id = task_list[0];
            }
            else{
                server_index += 1;
                continue;
            }
        }
        if (task_id){
            let task_step_list = StepDao.find({
                task_id:task_id
            });
            task_step_list.forEach(task_step_obj => {
                if (task_step_obj.name == undefined || task_step_obj.name.length == 0){
                    continue;
                }
                var source = server_index;
                var target = find_resource(task_step_obj.name,datas['resources'])
                if (target == -1){
                    continue;
                }
                datas['links'].push({
                    'source':source,
                    'target':target,
                    'value': get_value(task_step_obj);
                })
            });
        }
        var server_index += 1;
    });
    return datas;
}

var rmatrixAction = function(rmat){
    var rmatrix = {
        'links':[],
        'resources':[],
        'servers':[]
    }
    let resource_list = ResourceDao.find({});
    resource_list.forEach(obj => {
        rmatrix['resources'].push({'name':obj.name});
    });
    let server_list = FHIRServerDao.find({
        is_delete:false
    });
    var server_index = 0;
    server_list.forEach(obj => {
        rmatrix['servers'].push({'name':obj.name});
        let task_list = TaskDao.find({
            task_type:3,
            target_server:server_obj
        });   
        var task_id = undefined;
        if (task_list.length != 0) {
            task_id = task_list[0];
        }
        else {
            server_index += 1;
            continue;
        }
        if (task_id != undefined) {
            let task_step_list = StepDao.find({
                task_id:task_id
            });
            task_step_list.forEach(obj => {
                if (obj.name == undefined || obj.name.length == 0) {
                    continue;
                }
                var source = server_index;
                var target = find_resource(obj.name, rmatrix['resource']);
                if (target == -1) {
                    continue;
                }
                rmatrix['links'].push({
                    'source':source,
                    'target':target,
                    'value': get_value(obj);
                });
            });
        }
        server_index += 1;
    });
    return rmatrix;
}

var ttimeAction = function(tt){
    var ttimes = {
        'isSuccessful':true,
        'times':[]
    }
    var ttype = tt['ttype'];
    let time_list = TaskDao.find({
        task_type:ttype
    });
    time_list.forEach(t => {
        ttime.times.push(t.toUTCString());
    });
    // for (obj in time_list){
    //     ttime.times.push(t.toUTCString());
    // }
    return ttimes;
}

var cmatrixAction = function(cmat){
    var ttype = String(cmat.ttype)
    var cmatrix = {
        'isSuccessful':true,
        'matrix':{}
    }
    var ttime = "";
    if (cmat['time'] != undefined){
        ttime = cmat['time'];
    }
    console.log(ttime,ttype);
    cmatrix['matrix'] = form_matrix(ttype, ttime)
    return cmatrix;
}

module.exports = {
    rmatrixAction,
    ttimeAction,
    cmatrixAction
}