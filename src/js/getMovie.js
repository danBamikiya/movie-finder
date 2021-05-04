function logError(err) {
	console.log("Looks like there's a problem: \n", err);
}

function readResponseAsJSON(res) {
	return res.json();
}

function validateResponse(res) {
	if (!res.ok) {
		throw Error(res.statusText);
	}
	return res;
}

export default async function getMovie(searchText, showMovie) {
	if (searchText.length === 0) {
		return;
	}

	const movie = await fetch(
		`https://imdb-internet-movie-database-unofficial.p.rapidapi.com/film/${searchText}`,
		{
			method: 'GET',
			headers: {
				'x-rapidapi-key': process.env.RAPID_API_KEY,
				'x-rapidapi-host':
					'imdb-internet-movie-database-unofficial.p.rapidapi.com'
			}
		}
	)
		.then(validateResponse)
		.then(readResponseAsJSON)
		.catch(logError);
	showMovie(movie);
}
