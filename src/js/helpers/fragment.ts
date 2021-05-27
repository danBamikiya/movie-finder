import { HoverRendererParams, RendererFunction } from '../types';

export function processFragment<P extends HoverRendererParams>(
	rendererParams: P,
	renderer: RendererFunction<P>
): DocumentFragment {
	const div = document.createElement('div');
	const fragment = new DocumentFragment();

	const fragmentContent = renderer(div, rendererParams);
	fragment.appendChild(fragmentContent);

	return fragment;
}
