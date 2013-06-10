//myApp.js

var Person = require('./person');
var data = require('./data');
var util = require('./util')

var bob = new Person("Bob Dylan", 72);

var p;
for (i in data) {
	p = util.toPerson(data[i]);
	console.log(p.name, p.age);
}