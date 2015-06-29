var serialport = require("serialport"),
    SerialPort = serialport.SerialPort;
var serialPort = new SerialPort("/dev/ttyACM0", {
  baudrate: 9600,
  parser: serialport.parsers.readline("\n")
});

serialPort.on("open", function () {
	console.log('open');
  	serialPort.on('data', function(data) {
		console.log('data received: ' + data);
  	});
});