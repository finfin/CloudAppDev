var cluster = require('cluster');
var os = require('os');

var cores = os.cpus().length;

var workers = {};

if (cluster.isMaster) {
	console.log("cores:" + cores);
	cluster.on('exit', function(worker) {
		console.log("Worker " + worker.id + " died, respawning");
		delete workers[worker.pid];
		worker = cluster.fork();
		workers[worker.pid] = worker;
	});

	for (var i = 0; i < cores; i++) {
		var worker = cluster.fork();
		workers[worker.pid] = worker;
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