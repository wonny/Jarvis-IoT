var SSH = require('simple-ssh');

var ssh = new SSH({
    host: '192.168.0.200',
    user: 'root',
    pass: ''
});

ssh.exec('luna-send -n 1 -f luna://com.webos.applicationManager/launch \'{"id":"com.webos.app.tvguide"}\'', {
    out: function(stdout) {
        console.log(stdout);
    }
}).start()