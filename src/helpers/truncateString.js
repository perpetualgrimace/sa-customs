export default function truncateString(str, max = 40) {
	if (str && str.length) {
		if (str.length < max) {
			return str;
		}
	  return `${str.slice(0, max)}…`;
	}

	console.log("invalid string argument passed to truncateString()");
	return null;
}