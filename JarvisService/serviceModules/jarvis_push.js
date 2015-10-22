var gcm = require('node-gcm');
var Device = require('../DBModel/devices');

var server_access_key = config.gcm.apiKey;//'AIzaSyAjDbxmXPKbc2JzfvBF-QGum3toABS0_Co'; //Google console Account 등록시 발급되는 key
var sender = new gcm.Sender(server_access_key);

//device에서 GCM 등록시에 발급되는 RegisterId
var registrationIds = [];

exports.sendMessage = function(data){
	console.log( data);
	//TO-DO : DB에 저장된 값을 가져 와야함. ( 처리완료 )
	jarvisDB.userFind(null, function(results){
		for( var key in results ){
			registrationIds.push( results[key].registrationID )
		}
		invadeNotification(data);
	});
};

function invadeNotification(data){
	// create a message with default values
	// TO-DO : Message format define
	var message = new gcm.Message({
	    collapseKey: 'Jarvis',
	    delayWhileIdle: true,
	    timeToLive: 3,
	    data: {
	        message: "This intrusion was detected. Please check the contents.",
	        imagepath : data.url_m
	    }
	});

	/**
	 * Params: message-literal, registrationIds-array, No. of retries, callback-function
	 **/
	sender.send( message, registrationIds, 4, function (err, result) {
	    console.log(result);
	    registrationIds = [];
	});
}