//person.js

function Person(name, age) {
	this.name = name;
	this.age = age;
}

Person.prototype.intro = function() {
  return "Hi there, I am " + this.name + " and I am " + this.age + " years old now.";
}

module.exports = Person;