import { HoverRendererParams, RendererFunction } from '../../types';
import hoverCardMsgImgRenderer from './hoverCardImgRenderer';
import hoverCardMsgNameRenderer from './hoverCardNameRenderer';
import processFragment from './fragment';

function renderInto<P extends HoverRendererParams>(
	rendererParams: P,
	renderer: RendererFunction<P>
): HTMLElement {
	const div = document.createElement('div');
	return renderer(div, rendererParams);
}

function fragmentRenderer(
	parent: HTMLElement,
	{ actor, imdbPage, imgUrl }: HoverRendererParams
): HTMLElement {
	const fragmentContent = parent.cloneNode() as HTMLElement;
	fragmentContent.classList.add('pb-3', 'px-3');

	const srClose = parent.cloneNode() as HTMLElement;
	srClose.className = 'sr-only';
	srClose.appendChild(
		document.createTextNode('Press Escape to close this hovercard')
	);

	fragmentContent.append(
		renderInto({ actor, imdbPage }, hoverCardMsgNameRenderer),
		renderInto({ actor, imdbPage, imgUrl }, hoverCardMsgImgRenderer),
		srClose
	);

	return fragmentContent;
}

export default function processHoverCardDocumentFragment(
	actor: string,
	imdbPage: string,
	imgUrl: string
): DocumentFragment | undefined {
	if (!actor && !imdbPage) return;

	const div = document.createElement('div');
	return processFragment(fragmentRenderer(div, { actor, imdbPage, imgUrl }));
}
