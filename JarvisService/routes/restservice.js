//var Device = require('../DBModel/devices');
var express = require('express');
var router = express.Router();

router.route('/insert').get(function(req, res) {
	console.log( req.body );
  jarvisDB.userRegister(req.body, res);
});

router.route('/retrieve').get(function(req, res) {
  jarvisDB.userFind(res);

});

router.route('/remove').get(function(req, res) {
  jarvisDB.userRemove(res);
});

router.route('/invadeSetting').post(function(req, res) {
  config.isInvadeMode = req.body.invadeMode;
});

//Client Test
router.route('/receive').post(function(req, res) {
  console.log( "sensor data receive", req.body.filename  );
  res.setHeader('Content-Type', 'application/json');
  res.send({statusCode : 200, message:"sensor data receive"});

  var detectedImageObj = {
    name : req.body.filename,
    path : "",
    desc : ""
  };

  jarvisUpload.invadeImageUpload(detectedImageObj); //image upload test

});


module.exports = router;