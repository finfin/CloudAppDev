//TODO: fill in apn handler

var feedback = new apns.Feedback(options);
feedback.on("feedback", function(devices) {
    devices.forEach(function(item) {
        logger.warn(item);
    });
});*/