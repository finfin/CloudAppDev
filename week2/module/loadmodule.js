var util1 = require('./util')

console.log(util1.getOwner());

var util2 = require('./util')

util2.setOwner("BOB");
console.log("util2 owner: " + util2.getOwner() +", util1 owner:" + util1.getOwner());