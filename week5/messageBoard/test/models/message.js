var should = require('chai').should();
var Message = require('../../src/models/message');

describe('Message', function() {
	var message;
	var user = "testname";
	var text = "testtext";
	var type = "public";
	beforeEach(function() {
		message = new Message({
			user: user,
			text: text,
			type: type
		});
	});

	it('should have name, text and type', function() {
		message.user.should.equal(user);
		message.text.should.equal(text);
		message.type.should.equal(type);
		message.date.should.instanceOf(Date);
	});

});