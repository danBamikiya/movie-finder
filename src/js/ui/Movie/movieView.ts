import { Movie } from '../../types';
import processMovieDocumentFragment from './processFragment';
import memoize from '../../lib/memoizer';

const cachedMovieDocumentFragment = memoize(processMovieDocumentFragment);

export default function renderMovie(movie: Movie) {
	const container = document.querySelector('.container');
	if (!(container instanceof HTMLElement)) return;

	document.querySelector('movie-poster-details-container')?.remove();
	document.querySelector('movie-poster-container')?.remove();

	const fragment = cachedMovieDocumentFragment(movie);

	container.insertBefore(fragment.cloneNode(true), container.firstElementChild);
}
