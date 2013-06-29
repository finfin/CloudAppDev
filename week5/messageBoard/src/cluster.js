require('nodetime').profile({
	accountKey: '180dd7176a33ba89aaa6149e4f434a01e6a4b044',
	appName: 'Message Board'
});
var cluster = require('cluster');
var os = require('os');

var cores = os.cpus().length;

var workers = {};

if (cluster.isMaster) {
	console.log("cores:" + cores);
	cluster.on('exit', function(worker) {
		console.log("Worker " + worker.process.pid + " died, respawning");
		delete workers[worker.process.pid];
		worker = cluster.fork();
		workers[worker.process.pid] = worker;
	});

	for (var i = 0; i < cores; i++) {
		var worker = cluster.fork();
		workers[worker.process.pid] = worker;
		console.log("Worker " + worker.process.pid + " spawned");
	}
} else {
	var app = require('./app');
	app.listen(app.get('port'), function() {
		console.log("HTTP Server listening to port: " + app.get('port'));
	});
}

process.on('SIGTERM', function() {
	for (var pid in workers) {
		process.kill(pid);
	}
	process.exit(0);
});