var friends = {
	bill : {
		firstname: "bill",
		lastname: "gates", 
		number: 1
	},
	steve: {
		firstname: "steve",
		lastname: "jobs",
		number: 2
	}
}

friends.turner = {
	firstname: "j.m.w",
	lastname: "turner",
	number:3
}

delete friends.steve;
console.log(friends);