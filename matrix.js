var express = require('express');
var router = express.Router();
var matrixAction = require('../services/matrixAction')

var rmatrix = matrixAction.rmatrixAction;
var ttime = matrixAction.ttimeAction;
var cmatrix = matrixAction.cmatrixAction;

/*
router.get('/submit_task', function(req, res, next){
	// submit_task
	// get code, language, type
	var req_json = req.body;
	var code = req_json['code'];
	var language = req_json['language'];
    var test_type = req_json['type'];
    var resource_list = [];
    if (test_type == 3 || test_type == 0) {
    	var resource_state = req_json['resources'];
    	for (var item in resource_state){
    		if (item['checked']) {
    			resource_list.push(item['name'])
    		}
    	}
    }
    if ('chosen_server' in req_json){
    	try{
            var server_obj = server.objects.get(server_id=int(req_json['chosen_server']))
            var url = server_obj.server_url
            var access_token = server_obj.access_token
        }
        catch(err){
            var result = {
                'isSuccessful':false,
                'error':"Invalid server"
            }
			// return HttpResponse(json.dumps(result), content_type="application/json")
    	}
    } else {
    	var access_token = req_json['access_token']
        var url = req_json['url']
    }
    var token = undefined;
    try{
        token = req_json['token'];
    }
    catch(err){}
    
    var username = undefined;
    if (token){
	// username = auth.extract_username(token);
    }

    // return task id
    if ('chosen_server' in req_json){
        var task_id = perform_test(language=language,code=code,url=url,test_type=test_type,server_id=req_json['chosen_server'], resource_list=resource_list, access_token=access_token, username=username)
    }
    else{
        var task_id = perform_test(language=language,code=code,url=url,test_type=test_type,server_id=undefined;, resource_list=resource_list, access_token=access_token, username=username)
    }
    var result = {
        'isSuccessful':true,
        'task_id':task_id
    }
	// return HttpResponse(json.dumps(result), content_type="application/json");
});

router.get('/get_resources', function(req, res, next){
    var resource_type = req.GET.get('type', 0)
    if (isinstance(resource_type,str)){
        try{
            resource_type = int(resource_type);
        }
        catch{
            resource_type = 0;
        }
    }
    var result = {
        'isSuccessful':false,
        'names':[]
    }
    try{
        var resources = resource.objects.filter(resource_type=resource_type);
        for (resource_obj in resources){
            result['names'].push({'name':resource_obj.name,'checked':true});
        }
        result['isSuccessful'] = true;
    }
    catch(err){}
    return HttpResponse(json.dumps(result), content_type="application/json")
});

router.get('/add_new_server', function(req, res, next){
    var req_json = req.body;
    var result = {
        'isSuccessful': false
    }
    try{
        var server_name = req_json['name'];
        var server_url = req_json['url'];
        var access_token = undefined;
        if ('token' in req_json){
            access_token = req_json['token'];
        }
        // var new_server = server(server_name=server_name,server_url=server_url,access_token=access_token);
        // var new_server.save();
        result['isSuccessful'] = true
    }
    catch(err){}
    return HttpResponse(json.dumps(result), content_type="application/json")
});

router.get('/delete_server', function(req, res, next){
    var req_json = req.body;
    var result = {
        'isSuccessful': false
    }
    try{
        var server_id = req_json['id'];
        var server_obj = server.objects.get(server_id=server_id);
        if (server_obj.is_deletable){
            server_obj.is_delete = true;
            // server_obj.save()
            result['isSuccessful'] = true;
        }
        else{
            result['error'] = 'No access to delete this server';
        }
    }
    catch(err){
        result['error'] = 'problem while deleting';
    }
    // return HttpResponse(json.dumps(result), content_type='application/json')
});

router.get('/get_all_servers', function(req, rs, next){
    var result = {
        'isSuccessful' : false
    }
    try{
        var server_list = server.objects.filter(is_delete=false);
        result['servers'] = [];
        for (server_obj in server_list){
            result['servers'].append({'name':server_obj.server_name,'id':server_obj.server_id,'url':server_obj.server_url, 'is_deletable':server_obj.is_deletable});
        }
        result['isSuccessful'] = true;
    }
    catch(err){}
    // return HttpResponse(json.dumps(result), content_type="application/json")
});

router.get('/get_user_task_history', function(req, res, next){
    var req_json = req.body;
    try{
        var token = req_json['token'];
    }
    catch(err){
        return {
                'isSuccessful': false
            }
    }
    var result = {
        'isSuccessful': false
    }
    if (token){
        try{
            var username = auth.extract_username(token);
            var task_obj_list = task.objects.filter(user_id=username);
            var task_list = [];
            for (task_obj in task_obj_list){
                var task_id = task_obj.task_id;
                var task_time = task_obj.create_time;
                task_list.push({
                    'task_id':task_id,
                    'time':task_time.toUTCString()
                })
            }
            result['tasks'] = task_list;
            result['isSuccessful'] = true;
        }
        catch(err){}
    }
    // return HttpResponse(json.dumps(result), content_type="application/json")
});

router.get('/search_task', function(req, res, next){
    var req_json = req.body;
    var keyword = req_json['keyword'];
    var result = {
        'isSuccessful': true
    }
    result['tasks'] = search_basedon_id(keyword);
    // return HttpResponse(json.dumps(result), content_type="application/json")
});
*/

router.get('/rmatrix', function(req, res, next){
	// get_resource_matrix
	// rmatrix 
	// set JSON type
	var rmat = rmatrix(req.body.rmatrix);
	console.log('rmatrix: ', rmat);
	res.json({
		links:rmat.links,
        resources:rmat.resources,
        servers:rmat.servers	
	});
});

router.post('/ttime', function(req, res, next){
	// all test time
	var ttimes = ttime(req.body.times);
	console.log('times: ', ttimes);
	res.json({
        isSuccessful:ttimes.isSuccessful,
        times:ttimes.times
    });
});

router.post('/cmatrix', function(req, res, next){
	// certain matrix
	var cmat = cmatrix(req.body.matrix);
	console.log('cmatrix: ', cmat);
	res.json({
        isSuccessful:cmat.isSuccessful,
        matrix:{
            links:cmat.matrix.links,
            resources:cmat.matrix.resources,
            servers:cmat.matrix.servers
        }
	});
});

module.exports = router;
