export default function actorNameParser(actorName) {
	/** Regex to parse actors name */
	const regexParser = /([^\W])([\w]+)/gi;
	const result = actorName.match(regexParser);
	let parsedName = '';
	result.forEach(name => {
		parsedName += `${name}+`;
	});
	const name = parsedName.slice(0, -1); // remove ending '+' sign
	const casedName = name.toLowerCase();
	return casedName;
}
