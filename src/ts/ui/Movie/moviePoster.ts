import { Movie } from '../../types';

export function moviePosterRenderer(
	div: HTMLElement,
	{ poster: moviePoster, title: movieTitle }: Movie
): HTMLElement {
	const moviePosterContainer = div.cloneNode() as HTMLElement;
	moviePosterContainer.className = 'movie-poster-container';

	const posterImg = new Image();
	posterImg.crossOrigin = 'anonymous';
	posterImg.src = moviePoster;
	posterImg.alt = `${movieTitle} movie poster`;
	posterImg.title = `${movieTitle} movie poster`;
	posterImg.className = 'movie-poster';
	moviePosterContainer.appendChild(posterImg);

	return moviePosterContainer;
}
