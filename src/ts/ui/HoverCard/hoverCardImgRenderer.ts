import { HoverRendererParams } from '../../types';
import noPicImage from '../../../assets/imgs/no_pic_image.png';

export default function hoverCardMsgImgRenderer(
	div: Element,
	{ actor, imdbPage, imgUrl }: HoverRendererParams
): HTMLElement {
	const hoverCardMsgImgContainer = div.cloneNode() as HTMLElement;
	hoverCardMsgImgContainer.className = 'hover-card-message-img-bar';

	hoverCardMsgImgContainer.appendChild(div.cloneNode());
	const hoverCardImgLink =
		hoverCardMsgImgContainer.firstElementChild!.appendChild(
			document.createElement('a')
		);
	hoverCardImgLink.className = 'hover-card-message-img-link';
	hoverCardImgLink.href = imdbPage;
	hoverCardImgLink.target = '_blank';

	const img = new Image(60, 60);
	// consider dynamically importing `noPicImage`
	img.src = imgUrl || noPicImage;
	img.alt = imgUrl ? actor : `No photo available for ${actor}`;
	img.crossOrigin = 'anonymous';
	img.className = `hover-card-message-img-link-avatar${
		!imgUrl ? ' no-pic-image' : ''
	}`;

	hoverCardImgLink.appendChild(img);

	return hoverCardMsgImgContainer;
}
