import { HoverRendererParams } from '../../types';
import noPic from '../../../assets/imgs/no_pic.png';

export function hoverCardMsgImgRenderer(
	div: Element,
	{ actor, imdbPage, imgUrl }: HoverRendererParams
): HTMLElement {
	const a = document.createElement('a');
	const hoverCardMsgImgContainer = div.cloneNode() as HTMLElement;
	hoverCardMsgImgContainer.className = 'hover-card-message-img-bar';

	hoverCardMsgImgContainer.appendChild(div.cloneNode());
	const hoverCardImgLink =
		hoverCardMsgImgContainer.firstElementChild!.appendChild(
			a.cloneNode()
		) as HTMLAnchorElement;
	hoverCardImgLink.className = 'hover-card-message-img-link';
	hoverCardImgLink.href = imdbPage;
	hoverCardImgLink.target = '_blank';

	const img = new Image(60, 60);
	img.src = imgUrl || noPic;
	img.alt = imgUrl ? actor : `No photo available for ${actor}`;
	img.crossOrigin = 'anonymous';
	img.className = `hover-card-message-img-link-avatar${
		!imgUrl ? ' no-pic-image' : ''
	}`;

	hoverCardImgLink.appendChild(img);

	const links = hoverCardMsgImgContainer.appendChild(
		div.cloneNode()
	) as HTMLElement;
	links.className = 'actor-imdb-links';

	const morePhotos = links.appendChild(a.cloneNode()) as HTMLAnchorElement;
	morePhotos.innerText = 'More photos';
	morePhotos.href = `${imdbPage}mediaindex`;
	morePhotos.target = '_blank';

	const moviesClips = links.appendChild(a.cloneNode()) as HTMLAnchorElement;
	moviesClips.innerText = 'Movies clips';
	moviesClips.href = `${imdbPage}videogallery`;
	moviesClips.target = '_blank';

	return hoverCardMsgImgContainer;
}
