import { fetchSafeResponse } from '../helpers/fetch';
import { MOVIE_REQUEST_HEADERS } from '../config/imdbu';
import { Movie } from '../types';
import memoize from '../lib/memoizer';

const cachedFetchSafeMovie = memoize(fetchSafeResponse);

function logError(err: Error) {
	console.log("Looks like there's a problem: \n", err);
}

function parseResponse(movie: any): Movie | undefined {
	if (!movie) return;
	return {
		title: movie['title'].trim(),
		year: movie['year'],
		length: movie['length'],
		rating: movie['rating'],
		poster: movie['poster'],
		plot: movie['plot'],
		cast: movie['cast']
	};
}

function readResponseAsJSON(response: Response): Promise<any> {
	return response.json();
}

export default async function getMovie(
	searchText: string
): Promise<Movie | undefined> {
	let movie!: Movie | undefined;

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
