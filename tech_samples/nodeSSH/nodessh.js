var SSH = require('simple-ssh');

var ssh = new SSH({
    host: 'Devivce IP',
    user: 'root',
    pass: ''
});

ssh.exec('SSH Command', {
    out: function(stdout) {
        console.log(stdout);
    }
}).start()