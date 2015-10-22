var serialPort = require('serialport');
var SerialPort = require('serialport').SerialPort;
var connected = false;
var arduinoPort;

function connectToArduino(callback) {
    if (typeof arduinoPort === 'object' && typeof arduinoPort.isOpen === 'function' && arduinoPort.isOpen()) {
        return;
    }

    getArduinoSerialComName(function(err, comName) {
        if (err) {
            console.warn("Fail to get arduino port name. - " + new Date().toString());
            return;
        }

        arduinoPort = new SerialPort(comName, {
            baudrate: 9600,
            dataBits: 8,
            parity: 'none',
            stopBits: 1,
            flowControl: false
        });

        arduinoPort.on('open', function() {
            console.log('Arduino port is opened.( ' + comName + ' ) ' + new Date().toString());
            ready = true; // Change the status
            arduinoPort.on('data', function(data) {
                console.log('data received: ' + data);
                if( config.isInvadeMode )
                    callback(data);
            });
            arduinoPort.on('disconnect', function() {
                console.log('Arduino port is disconnected.( ' + comName + ' ) ' + new Date().toString() );
                ready = false; // Change the status
            });
        });
    });
}

function getArduinoSerialComName(callback) {
    serialPort.list(function(err, ports) {
        if (err) {
            console.log(err);
            callback(err);
            return;
        }

        ports.forEach(function(port) {
        	console.log( "connect", port );
            if (typeof port.manufacturer === 'string' && port.manufacturer.toLowerCase().indexOf('arduino') > -1) {
                if (typeof callback === 'function') {
                    callback(null, port.comName);
                    return;
                }
            }
        });
    });
}

/*setInterval(function() {
    connectToArduino();
}, 3000);*/
exports.connectToArduino = connectToArduino;