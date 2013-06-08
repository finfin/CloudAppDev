//myApp.js

var Person = require('./person');
var data = require('./data');
var util = require('./util')

var bob = new Person("Bob Dylan", 72);

console.log(bob.intro());
console.log(util.toJson(bob));