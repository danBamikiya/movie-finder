import { HoverRendererParams } from '../../types';

export default function hoverCardMsgNameRenderer(
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
