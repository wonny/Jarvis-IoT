var request = require('request');

var arguments = process.argv.slice(2);

// Test Sample
request.post({url:'http://localhost:9000/jarvis/receive', form: { filename : arguments[0] } },  function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body)
  }
})


request.post({url:'http://localhost:9000/jarvis/invadeSetting', form: { invadeMode : true } },  function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body)
  }
})


