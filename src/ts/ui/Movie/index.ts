import { Movie } from '../../types';
import { Elements } from '../../dom';
import { memoize } from '../../lib';
import { clearUI } from '../../actions';
import {
	processMovieFragment,
	processMovieTrailerFragment
} from './processFragment';

const cachedMovieFragment = memoize(processMovieFragment);
const cachedMovieTrailerFragment = memoize(processMovieTrailerFragment);
const container = Elements.container;
const movieTrailer = Elements.movieTrailer;

export async function renderMovie(movie: Movie) {
	if (!(container instanceof HTMLElement)) return;

	let fragment!: DocumentFragment | undefined;
	clearUI();

	fragment = cachedMovieFragment(movie);
	/** The Document Fragment is being cloned so that the cached original can be reused */
	container.insertBefore(fragment.cloneNode(true), container.firstElementChild);

	fragment = await cachedMovieTrailerFragment(movie);
	if (fragment) {
		/** The Document Fragment is being cloned so that the cached original can be reused */
		movieTrailer.appendChild(fragment.cloneNode(true));
		// @ts-ignore
		document.querySelector('.video-player')?.play();
	}
}
