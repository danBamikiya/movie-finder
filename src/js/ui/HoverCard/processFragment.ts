import { processFragment } from '../helpers/fragment';
import { HoverRendererParams, RendererFunction } from '../types';

function hoverCardMsgImgRenderer(
	div: Element,
	{ actor, imdbPage, imgUrl }: HoverRendererParams
): HTMLElement {
	const hoverCardMsgImgContainer = div.cloneNode() as HTMLElement;
	hoverCardMsgImgContainer.className = 'hover-card-message-img-bar';

	hoverCardMsgImgContainer.appendChild(div.cloneNode());
	const hoverCardImgLink = hoverCardMsgImgContainer.firstElementChild!.appendChild(
		document.createElement('a')
	);
	hoverCardImgLink.className = 'hover-card-message-img-link';
	hoverCardImgLink.href = imdbPage;
	hoverCardImgLink.target = '_blank';

	const img = new Image(60, 60);
	img.src = imgUrl || '/assets/imgs/no_pic_image.png';
	img.alt = imgUrl ? actor : `No photo available for ${actor}`;
	img.crossOrigin = 'anonymous';
	img.className = `hover-card-message-img-link-avatar${
		!imgUrl ? ' no-pic-image' : ''
	}`;

	hoverCardImgLink.appendChild(img);

	return hoverCardMsgImgContainer;
}

function hoverCardMsgNameRenderer(
	div: Element,
	{ actor, imdbPage }: HoverRendererParams
): HTMLElement {
	const hoverCardMsgNameContainer = div.cloneNode() as HTMLElement;
	hoverCardMsgNameContainer.className = 'hover-card-message-name-bar';

	hoverCardMsgNameContainer.appendChild(div.cloneNode());
	hoverCardMsgNameContainer.firstElementChild!.className =
		'hover-card-message-name';

	const actorName = document.createElement('a');
	actorName.href = imdbPage;
	actorName.target = '_blank';
	actorName.innerText = actor;
	hoverCardMsgNameContainer.firstElementChild!.appendChild(actorName);

	return hoverCardMsgNameContainer;
}

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

	return processFragment({ actor, imdbPage, imgUrl }, fragmentRenderer);
}
