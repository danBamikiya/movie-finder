import { fetchSafeResponse } from '../helpers/fetch';
import { MOVIE_REQUEST_HEADERS } from '../config/imdbu';
import memoize from '../lib/memoizer';

const cachedFetchSafeMovie = memoize(fetchSafeResponse);

function logError(err: Error) {
	console.log("Looks like there's a problem: \n", err);
}

function parseResponse(response: Response): Promise<any> {
	return response.json();
}

export default async function getMovie(
	searchText: string,
	showMovie: (movie: any) => void
) {
	if (!searchText.length) return;

	let movie;

	try {
		movie = await cachedFetchSafeMovie(
			`https://imdb-internet-movie-database-unofficial.p.rapidapi.com/film/${searchText}`,
			parseResponse,
			{
				method: 'GET',
				headers: MOVIE_REQUEST_HEADERS
			}
		);
	} catch (error) {
		logError(error);
	}

	showMovie(movie);
}
