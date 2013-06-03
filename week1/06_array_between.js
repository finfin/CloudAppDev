function between(string, start, end) {
  var startAt = string.indexOf(start);
  var endAt = string.indexOf(end, startAt);

  if(startAt === -1 || endAt === -1)
  	return "";
  return string.slice(startAt +start.length, endAt);
}

console.log(between("hola [hello] bon", "[", "]"));