import { Movie, RendererFunction } from '../../types';
import moviePosterRenderer from './moviePosterRenderer';
import movieDetailsRenderer from './movieDetailsRenderer';
import fragment from './fragment';

function renderInto<P extends Movie>(
	rendererParams: P,
	renderer: RendererFunction<P>
): HTMLElement {
	const div = document.createElement('div');
	return renderer(div, rendererParams);
}

export default function processMovieDocumentFragment(Movie: Movie) {
	return fragment([
		renderInto(Movie, movieDetailsRenderer),
		renderInto(Movie, moviePosterRenderer)
	]);
}
