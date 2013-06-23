var apns = require('apn');
var util = require('util');
var log4js = require('log4js');
var logger = log4js.getLogger();

var options = {
    cert: 'config/cert.pem',                 /* Certificate file path */
    key:  'config/key.pem',                  /* Key file path */
    gateway: 'gateway.sandbox.push.apple.com',/* gateway address */
    port: 2195,                       /* gateway port */
    errorCallback: function(err) {logger.error(err)},    /* Callback when error occurs function(err,notification) */
};

var apnsConnection = new apns.Connection(options);

exports.notification = function(token, message) {
	var device;
	if (util.isArray(token)) {
		device = [];
		token.forEach(function(e) {
			device.push(new apns.Device(e));
			
		});
	} else {
		device = new apns.Device(token);	
	}
	var note = new apns.Notification();
	note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
	note.badge = 1;
	note.sound = "ping.aiff";
	note.alert = message;
	note.payload = {'messageFrom': 'Caroline'};
	//note.device = myDevice;
	console.log(note, device)
	apnsConnection.pushNotification(note, device);
}

var options = {
    "batchFeedback": true,
    "interval": 60
};

var feedback = new apns.Feedback(options);
feedback.on("feedback", function(devices) {
    devices.forEach(function(item) {
        logger.warn(item);
    });
});