const div = document.createElement('div');

function renderInto(element, actor, imdbPage, imgUrl) {
	switch (element) {
		case 'img':
			const hoverCardMsgImgContainer = div.cloneNode();
			hoverCardMsgImgContainer.className = 'hover-card-message-img-bar';

			hoverCardMsgImgContainer.appendChild(div.cloneNode());
			const hoverCardImgLink = hoverCardMsgImgContainer.firstElementChild.appendChild(
				document.createElement('a')
			);
			hoverCardImgLink.className = 'hover-card-message-img-link';
			hoverCardImgLink.href = imdbPage;
			const img = document.createElement(element);
			img.src = imgUrl;
			img.alt = actor;
			img.className = 'hover-card-message-img-link-avatar';
			img.crossOrigin = 'anonymous';
			hoverCardImgLink.appendChild(img);

			return hoverCardMsgImgContainer;

		case 'a':
			const hoverCardMsgNameContainer = div.cloneNode();
			hoverCardMsgNameContainer.className = 'hover-card-message-name-bar';

			hoverCardMsgNameContainer.appendChild(div.cloneNode());
			hoverCardMsgNameContainer.firstElementChild.className =
				'hover-card-message-name';

			const actorName = document.createElement(element);
			actorName.href = imdbPage;
			actorName.innerText = actor;
			hoverCardMsgNameContainer.firstElementChild.appendChild(actorName);

			return hoverCardMsgNameContainer;

		default:
			break;
	}
}

export default function processHoverCardDocumentFragment(
	actorName,
	actorImdbPage,
	hovercardImgUrl
) {
	if (!actorImdbPage && !actorName) return;

	const fragment = new DocumentFragment();
	const fragmentContent = div.cloneNode();
	fragmentContent.classList.add('pb-3', 'px-3');

	const srClose = div.cloneNode();
	srClose.className = 'sr-only';
	srClose.appendChild(
		document.createTextNode('Press Escape to close this hovercard')
	);

	fragmentContent.append(
		renderInto('a', actorName, actorImdbPage),
		renderInto('img', actorName, actorImdbPage, hovercardImgUrl),
		srClose
	);

	fragment.appendChild(fragmentContent);

	return fragment;
}
