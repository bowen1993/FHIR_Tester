let models = require('../models');
var bcrypt = require('bcrypt');
let User = models.User;
let UserDao = models.UserDao;
var Base64 = require('js-base64').Base64;

const saltRounds = 10;

var registerAction = function(user_info){
    var username = user_info.username;
    console.log(username);
    if( isUserExists(username) ){
        console.log('exists');
        return false;
    }
    var password = user_info.password;
    console.log(password);
    var hashed_password = bcrypt.hashSync(password, saltRounds);
    var new_user = new User({
        username:username,
        password:hashed_password,
        user_level: 0
    });
    UserDao.create(new_user);
    console.log(new_user.toObject({recursive:true}))
    return true;
}

var loginAction = function(user_info){
    var username = user_info.username;
    console.log(username);
    var user = UserDao.findOne({
        username:username
    });
    if( !user ){
        return false;
    }
    var user_obj = user.toObject({recursive:true});
    console.log(user_obj)
    var password = user_info.password;
    var isMatch = bcrypt.compareSync(password, user_obj.password);
    return isMatch;
}

var get_token = function(username){
    return Base64.encode(username);
}

var get_token_username = function(token){
    return Base64.decode(token);
}

var isUserExists = function(username){
    var users = UserDao.find({
        username:username
    });
    return users != null && users.length != 0;
}

module.exports = {
    registerAction,
    loginAction,
    get_token,
    get_token_username
}