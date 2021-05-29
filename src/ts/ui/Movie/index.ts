import { Movie } from '../../types';
import { Elements } from '../../base';
import processMovieDocumentFragment from './processFragment';
import memoize from '../../lib/memoizer';

const cachedMovieDocumentFragment = memoize(processMovieDocumentFragment);
const container = Elements.container;

export default function renderMovie(movie: Movie) {
	if (!(container instanceof HTMLElement)) return;

	document.querySelector('.movie-poster-details-container')?.remove();
	document.querySelector('.movie-poster-container')?.remove();

	const fragment = cachedMovieDocumentFragment(movie);

	/** The Document Fragment is being cloned so that the cached original can be reused */
	container.insertBefore(fragment.cloneNode(true), container.firstElementChild);
}
