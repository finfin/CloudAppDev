var should = require('chai').should();
var Message = require('../../models/message')
describe('Message', function() {
	var message;
	var name = "testname";
	var text = "testtext";
	beforeEach(function() {
		message = new Message("testname", "testtext");
	})

	it('should have name, text', function() {
		message.name.should.equal(name);
		message.text.should.equal(text);
	});

	it('should save correctly', function() {
		message.save();

		Message.messages.length.should.equal(1);
	});

	it('should remove correctly', function() {
		Message.remove(0);

		Message.messages.length.should.equal(2);
		Message.messages[0].name.should.equal(name);
		Message.messages[0].text.should.equal(text);
	});

})