export default function actorNameParser(actor) {
	/** Regex to parse actors name */
	const regexParser = /([^\W])([\w]+)/gi;
	const result = actor.match(regexParser);
	let parsedName = '';
	result.forEach(name => {
		parsedName += `${name}+`;
	});
	const name = parsedName.slice(0, -1);
	const casedName = name.toLowerCase();
	return casedName;
}
