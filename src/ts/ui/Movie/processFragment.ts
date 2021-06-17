import { Movie, RendererFunction } from '../../types';
import { moviePosterRenderer } from './moviePoster';
import { movieDetailsRenderer } from './movieDetails';
import { fragment } from './fragment';

function renderInto<P extends Movie>(
	rendererParams: P,
	renderer: RendererFunction<P>
): HTMLElement {
	const div = document.createElement('div');
	return renderer(div, rendererParams);
}

export function processMovieDocumentFragment(Movie: Movie) {
	return fragment(
		renderInto(Movie, moviePosterRenderer),
		renderInto(Movie, movieDetailsRenderer)
	);
}
