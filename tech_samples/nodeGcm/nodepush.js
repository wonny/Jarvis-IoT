var gcm = require('node-gcm');

// create a message with default values
var message = new gcm.Message();

// or with object values
var message = new gcm.Message({
    collapseKey: 'demo',
    delayWhileIdle: true,
    timeToLive: 3,
    data: {
        key1: 'HI.',
        key2: 'Detected access~~~!!'
    }
});

var server_access_key = 'AIzaSyCDvkx2gmugOYH8oRO0lp9jMg-CqY-rcPg';
var sender = new gcm.Sender(server_access_key);
var registrationIds = [];

var registration_id = 'APA91bFPfZle641hnRmBKIRCceS2JcVgqTi9o99Yw9u7wXSpQP-j6a_BJfDevsW2_i0nkT_wv9THIPNJ63OdqduHj4gqZxI_OK1iK3yOVvUeai6XrWCLCZc3GQv_BIsrR-0tmLGl0Y1IHCDb7krZvAo2WYkdtzkgsg';

registrationIds.push(registration_id);

/**
 * Params: message-literal, registrationIds-array, No. of retries, callback-function
 **/
sender.send(message, registrationIds, 4, function (err, result) {
    console.log(result);
});