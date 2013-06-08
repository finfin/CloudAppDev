var sleep = require('sleep');

function countDown(from) {

	if (!from || parseInt(from) < 0) {
		return;
	}
	sleep.sleep(1);
	console.log("Count down:" + from)
	process.nextTick(function(){countDown(from - 1)});
}

function processing() {
	
	var calls = Math.ceil(Math.random()*10);
	require('util').log(calls);
	process.nextTick(processing);
}
countDown(10);
processing();
