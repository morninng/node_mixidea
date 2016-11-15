var express = require('express');
var path = require('path');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("index is called");
  res.render('index', { title: 'Express' });
});

router.get('/*', function(req, res, next) {

  console.log("test is called");
  const index_file = path.resolve(__dirname , '../public/index.html')
  res.sendFile(index_file);
});


module.exports = router;
