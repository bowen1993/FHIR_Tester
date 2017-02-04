var express = require('express');
var router = express.Router();
let models = require('../models');

let ResourceDao = models.ResourceDao;
/* GET users listing. */
router.get('/', function(req, res, next) {
  var resources = ResourceDao.find({});
  res.send(resources);
});

module.exports = router;
