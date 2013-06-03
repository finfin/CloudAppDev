function getSmallerEvens(num) {
	try {
		if (isNaN(num) || num < 0)
			throw new Error("Argument error"); 
		var result = "";
		for (var i = 2; i < num; i += 2) {
			//if (i%2 !== 0) continue;
			result += i + ", "
		}
	    return result;
	}
	catch (e) {
		return e.message;
	}
}

console.log(getSmallerEvens(11));