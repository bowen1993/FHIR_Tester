var express = require('express');
var router = express.Router()
var serverAction = require('../services/serverAction')

var add_new_server = serverAction.add_new_server;
var all_servers = serverAction.all_servers;
var delete_server = serverAction.delete_server;

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/addServer', function(req, res, next){
    var name = req.body.name;
    var url = req.body.url;
    var access_token = null;
    console.log(name)
    if( req.body.token ){
        access_token = req.body.token;
    }
    add_new_server(name, url, access_token);
    res.json({isSuccessful:true});
});

router.get('/servers', function(req, res, next){
    var servers = all_servers();
    res.json({
        isSuccessful:true,
        servers:servers
    });
})

router.post('/deleteServer', function(req, res, next) {
    var server_id = req.body.id;
    var isSuccessful = delete_server(server_id);
    res.json({
        isSuccessful:isSuccessful,
        error: !isSuccessful ? 'Server cannot be deleted' : null
    });
})

module.exports = router;
