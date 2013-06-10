var sleep = require('sleep');
var events = require('events')
var emitter = new events.EventEmitter();

function countDown(from) {

    if (!from || parseInt(from) < 0) {
        return;
    }
    sleep.sleep(1);
    console.log("Count down:" + from)
    // emitter.emit();
    process.nextTick(function() {emitter.emit('countDown', from - 1);});
}

function processing() {
    sleep.sleep(0.2);
    var calls = Math.ceil(Math.random() * 10);
    console.log(calls);
    process.nextTick(function() {emitter.emit('processing');});
    
}

emitter.on('countDown', countDown);
emitter.on('processing', processing);

emitter.emit('countDown', 10);
emitter.emit('processing');
emitter.emit('error');