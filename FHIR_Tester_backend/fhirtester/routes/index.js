var express = require('express');
var router = express.Router();
let models = require('../models');
let ResourceDao = models.ResourceDao;
let Resource = models.Resource;

/* GET home page. */
router.get('/', function(req, res, next) {
  var new_resource = new Resource({name:'Sequence'});
  ResourceDao.create(new_resource);
  res.render('index.html', {});
});

module.exports = router;
