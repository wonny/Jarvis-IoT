var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var rest = require('./routes/restservice'); //routes are defined here
var app = express(); //Create the Express app
var arduionCon = require('./serviceModules/jarvis_arduino');

//Temporary global variable ( Find other ways )
//var jarvisSsh = require('./serviceModules/jarvis_ssh');
global.config = require('./config/config');
global.jarvisUpload = require('./serviceModules/jarvis_flickrUpload');
global.jarvisDB = require('./serviceModules/jarvis_db');

var connectionString = 'mongodb://' + config.database.dbHost + ':' + config.database.dbPort +  '/' + config.database.dbName;

app.set('port', config.server.port);//process.env.PORT || 9000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/jarvis', rest);

/*mongodb use*/
mongoose.connect(connectionString, function(err){
  if( err ){
    console.log('mongoose connection error :'+err);
    //throw err;
  }else{
    console.log(config.database.dbName + ' mongoDB connection Success!!!');
  }

  app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));

    //TO-DO : Aduino Sensor Data Receive logic
    //arduionCon.connectToArduino(/*callback function : take Picture*/);

    //jarvisSsh.launchapp("com.palm.app.enyo2sampler"); //ssh test
  });
});

/*var os = require('os');

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

console.log(addresses);*/