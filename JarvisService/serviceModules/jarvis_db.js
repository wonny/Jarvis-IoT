var Device = require('../DBModel/devices');

exports.userRegister = function(data, response){
	//var device = new Device({name:data.name, registrationID : data.registrationId}); //db model create
	//TO-DO : register Test
	var device = new Device( {name:"wonjun", registrationID : "APA91bHl-mTBVXgfbC9biIAw4LRjV3VcvwMV_11autWQ-3Io1WXQ1LwJboeF4xk2HyyzVFxWNM3anM6jV44H_NmQzuZG3-SdUhyGORybA0L7mV4mQGKKtWOeZb8QM24t5G5bcp8jZmsf"});
  	device.save(function(err) {
		if (err) {
			return response.send(err);
		}
		response.send({ message: 'Device Added Success' });
	});
}

exports.userFind = function(response, callback ){

	Device.find(function(err, result) {
	    if (err) {
	      return response != null ? response.send(err) : err;
	    }
	    console.log( result );

	    if( response != null ){
	    	response.json("results = " + result + "\n")
	    }else{
	    	callback(result);
	    }
	});
}

exports.userRemove = function(response) {
	Device.remove(function(err, result) {
	    if (err) {
	      return response.send(err);
	    }
	    response.json("Device DB Clear");
    });
}