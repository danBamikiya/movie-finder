export default function fragment(renderedContents: HTMLElement[]): DocumentFragment {
	const fragment = new DocumentFragment();

	for (const renderedContent of renderedContents) {
		fragment.appendChild(renderedContent);
	}

	return fragment;
}
