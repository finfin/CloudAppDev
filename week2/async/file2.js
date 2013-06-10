var fs = require('fs');
var async = require('async');


async.series([
    function(callback) {
        fs.exists('./input.txt', function(exists) {
            if (!exists) {
                callback(new Error("file not exist"));
            }
            callback(null, true);
        });
    },
    function(callback) {
        fs.stat('./input.txt', function(err, stat) {
            if (err) {
                callback(err);
            }
            console.log('File size: ' + stat.size);
            callback(null, true);
        });
    },
    function(callback) {
        fs.readFile('./input.txt', 'UTF-8', function(err, data) {
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
        return;
    }

    console.log("operation completed!");
});