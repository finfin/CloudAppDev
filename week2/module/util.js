var owner = "Fin";

exports.setOwner = function(name) {
	owner = name;
}

exports.getOwner = function () {
  return owner;
}

exports.toJson = function(person) {
	return JSON.stringify(person);
}