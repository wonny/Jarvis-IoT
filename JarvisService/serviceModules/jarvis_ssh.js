var SSH = require('simple-ssh');

var ssh = new SSH({
    host: '192.168.0.200',
    user: 'root',
    pass: ''
});

exports.launchapp = function(appID){
	console.log("LaunchApp", appID );
	ssh.exec('luna-send -n 1 -f luna://com.webos.applicationManager/launch \'{"id":"'+ appID +'"}\'', { //luna-send -n 1 -f luna://com.webos.applicationManager/launch \'{"id":'+ appID +'}\'
	    out: function(stdout) {
	        console.log(stdout);
	    },
	    err: function(stderr){
	    	console.log(stderr);
	    }
	}).start();
};