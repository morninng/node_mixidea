var express = require('express');
var path = require('path');

var router = express.Router();

/* GET home page. */
 

router.get('/test', function(req, res, next) {
  console.log("admin test is called");
  res.render('admin-test', { title: 'admin test' });
});


router.get('/terms_of_services', function(req, res, next) {
  console.log("terms_of_services is called");
  res.render('terms-of-services');
});

router.get('/privacy_policy', function(req, res, next) {
  console.log("privacy-policy is called");
  res.render('privacy-policy');
});


module.exports = router;
