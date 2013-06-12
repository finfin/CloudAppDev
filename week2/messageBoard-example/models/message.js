function Message(name, text) {
	this.name = name;
	this.text = text;
	this.date = new Date();
}

Message.prototype.save = function() {
	Message.messages[Message.messages.length] = this;
}

Message.remove = function(index) {
	// find message with id
	// remove from messages
	Message.messages.splice(index, 1);
}

Message.myMessage = function(name) {
	return Message.messages.filter(function(e) {
		return e.name === name;
	});
};

Message.messages = [new Message("fin", "頭推")];

module.exports = Message;