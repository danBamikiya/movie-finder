import { Movie } from '../../types';
import { Elements } from '../../dom';
import { memoize } from '../../lib';
import { clearUI } from '../../actions';
import { processMovieDocumentFragment } from './processFragment';

const cachedMovieDocumentFragment = memoize(processMovieDocumentFragment);
const container = Elements.container;

export function renderMovie(movie: Movie) {
	if (!(container instanceof HTMLElement)) return;

	const fragment = cachedMovieDocumentFragment(movie);
	clearUI();

	/** The Document Fragment is being cloned so that the cached original can be reused */
	container.insertBefore(fragment.cloneNode(true), container.firstElementChild);
}
