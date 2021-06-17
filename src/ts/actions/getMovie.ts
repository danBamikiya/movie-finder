import { Movie } from '../types';
import { memoize } from '../lib';
import { fetchSafeResponse } from '../helpers/fetch';
import { MOVIE_REQUEST_HEADERS } from '../config/imdbu';

const cachedFetchSafeMovie = memoize(fetchSafeResponse);

function logError(err: Error) {
	console.log("Looks like there's a problem: \n", err);
}

function parseResponse(movie: any): Movie | undefined {
	if (!movie || !Object.keys(movie).length) return;
	return {
		title: movie['title'].trim(),
		year: movie['year'],
		length: movie['length'],
		rating: movie['rating'],
		poster: movie['poster'],
		plot: movie['plot'],
		cast: movie['cast'],
		trailer: movie['trailer']
	};
}

function readResponseAsJSON(response: Response): Promise<any> {
	return response.json();
}

export async function getMovie(searchText: string): Promise<Movie | undefined> {
	let movie!: Movie | undefined;

	/**
	 * This makes a fetch() request to a movies api using a fetch helper function.
	 * Callbacks to parse the response and the request headers are also passed to
	 * the function.
	 * The movie response is cached.
	 */

	try {
		movie = await cachedFetchSafeMovie(
			`https://imdb-internet-movie-database-unofficial.p.rapidapi.com/film/${searchText}`,
			[readResponseAsJSON, parseResponse],
			{
				method: 'GET',
				headers: MOVIE_REQUEST_HEADERS
			}
		);
	} catch (error) {
		logError(error);
	}

	return movie;
}
