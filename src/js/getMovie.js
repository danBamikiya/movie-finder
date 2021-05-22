import { fetchSafeResponse } from '../utils/fetch';
import memoize from '../lib/memoizer';

const cachedFetchSafeMovie = memoize(fetchSafeResponse);

function logError(err) {
	console.log("Looks like there's a problem: \n", err);
}

function parseResponse(response) {
	return response.json();
}

export default async function getMovie(searchText, showMovie) {
	if (!searchText.length) return;

	let movie;

	try {
		movie = await cachedFetchSafeMovie(
			`https://imdb-internet-movie-database-unofficial.p.rapidapi.com/film/${searchText}`,
			{
				method: 'GET',
				headers: {
					'x-rapidapi-key': process.env.RAPID_API_KEY,
					'x-rapidapi-host':
						'imdb-internet-movie-database-unofficial.p.rapidapi.com'
				}
			},
			parseResponse
		);
	} catch (error) {
		logError(error);
	}

	showMovie(movie);
}
