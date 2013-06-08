var fs = require('fs');
var async = require('async');


async.series([
    function(callback) {
        fs.mkdir('./hello', 0777, function(err) {
            if (err) {
                callback(err);
            }
            callback(null, true);
        });
    },
    function(callback) {
        fs.writeFile('./hello/world.txt', 'Hello!', function(err) {
            if (err) {
                callback(err);
            }
            console.log('File created with contents: ');
            callback(null, true);
        });
    },
    function(callback) {
        fs.readFile('./hello/world.txt', 'UTF-8', function(err, data) {
            if (err) {
                callback(err);
            }
            console.log(data);
            callback(null, true);
        });
    }
], function(err, results) {
    if(err) {
        console.log("Error occured:", err);
    }

    console.log("operation completed!");
});