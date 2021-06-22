import { Elements } from '../dom';

export function clearUI() {
	document.querySelector('.movie-poster-container')?.remove();
	document.querySelector('.movie-details-container')?.remove();
	Elements.movieTrailer.innerHTML = '';
}
