var should = require('chai').should();
var Message = require('../../models/message')
describe('Message', function() {
	it('should have name, text input', function() {
		var name = "testname";
		var text = "testtext";
		var message = new Message(name, text);

		message.name.should.equal(name);
		message.text.should.equal(text);
		
	});

	it('should test', function() {
		(-1).should.equal([1,2,3].indexOf(5));
	});

})