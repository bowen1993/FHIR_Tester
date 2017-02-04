var express = require('express');
var router = express.Router();
var userAction = require('../services/userAction');
/* GET users listing. */

var register = userAction.registerAction;
var login = userAction.loginAction;
var get_token = userAction.get_token;
router.post('/register', function(req, res, next) {
  console.log(req.body);
  var isSuccessful = register(req.body);
  res.json({
    isSuccessful:isSuccessful,
    error: isSuccessful ? null : 'Invalid username or password'
  });
});

router.post('/login', function(req, res, next) {
  console.log(req.body);
  var isSuccessful = login(req.body);
  res.json({
    isSuccessful:isSuccessful,
    error: isSuccessful ? null : 'Invalid username or password',
    token: isSuccessful ? get_token(req.body.username) : null
  });
});

router.get('/logout', function(req, res, next){
  res.send('');
})

module.exports = router;
