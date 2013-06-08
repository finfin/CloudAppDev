function Message(name, text) {
	this.name = name;
	this.text = text;
	this.date = new Date();
}

Message.prototype.save = function() {
	Message.messages[Message.messages.length] = this;
	Message.id = Message.messages.length;
}

Message.remove = function(index) {
	// find message with id
	// remove from messages
}

Message.messages = [new Message("fin", "頭推")];

module.exports = Message;