/*
	@params	actorName: string 	eg: 'Tony Stark'
	@desc	This convert uppercased names like Tony Stark to IMDB query-able names like tony+stark
*/

function parseFromCasedName(actorName) {
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

export default function actorNameParser(actorName, type) {
	if (type === 'casedName') return parseFromCasedName(actorName);
	if (type === 'urlWithName') return parseFromUrl(actorName);

	return actorName;
}
