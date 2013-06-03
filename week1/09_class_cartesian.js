function Cartesian (x, y) {
    if (isNaN(x) || isNaN(y)) {
        throw new Error("Argument not number"); 
    };
    this.x = x;
    this.y = y;
}

Cartesian.ORIGIN = new Cartesian(0, 0);
Cartesian.prototype.distance = function(cartObj) {
    if (arguments.length < 1)
        cartObj = Cartesian.ORIGIN;
    var distX = this.x - cartObj.x;
    var distY = this.y - cartObj.y;
    return Math.sqrt(distX*distX + distY*distY);
}

Cartesian.prototype.furthur = function(cartObj) {
    return this.distance() > cartObj.distance();
};

Cartesian.prototype.toString = function() { return "{" + this.x + ", " + this.y + "}";};

var c24 = new Cartesian(2, 4);
var c46 = new Cartesian(4,6)
console.log(c24.toString());
console.log(c24.distance(c46));
console.log(c46.furthur(c24));
console.log(Cartesian.ORIGIN);