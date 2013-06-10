require("chai").should();

describe('Array', function(){
  beforeEach(function(){
    //test setup
    //done()
  });

  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      (-1).should.equal([1,2,3].indexOf(5));
      (-1).should.equal([1,2,3].indexOf(1));
    });
    
    //more tests
  })
})