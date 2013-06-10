var Person = require('./person');
var owner = "Fin";

exports.setOwner = function(name) {
	owner = name;
}

exports.getOwner = function() {
	return owner;
}

exports.toJson = function(person) {
	return JSON.stringify(person);
}

exports.toPerson = function(data) {
	return new Person(data.name, data.age);
}