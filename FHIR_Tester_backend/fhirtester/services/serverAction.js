let models = require('../models');
let Server = models.FHIRServer;
let ServerDao = models.FHIRServerDao;

var add_new_server = function(name, url, token=null){
    var new_server = new Server({
        name:name,
        url:url,
        access_token:token,
        is_deletable: true,
        is_delete:false
    });
    console.log(new_server);
    ServerDao.create(new_server);
    console.log('created');
}

var all_servers = function(){
    var server_info = {
        includes: [
            'name',
            'url',
            'id',
            'is_deletable'
        ]
    };
    var servers = ServerDao.find({
        is_delete:false
    });
    var format_servers = Server.toObjectArray(servers, server_info);
    return format_servers;
}

var delete_server = function(server_id){
    var server = ServerDao.findOne({
        id:server_id
    });
    var isSuccessful = false;
    if( server && server.is_deletable){
        server.is_delete = true;
        ServerDao.update(server)
        isSuccessful = true
    }
    return isSuccessful;
}

module.exports = {
    add_new_server,
    all_servers,
    delete_server
}