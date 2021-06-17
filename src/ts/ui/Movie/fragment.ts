export function fragment(...fragmentContents: HTMLElement[]): DocumentFragment {
	const fragment = new DocumentFragment();

	fragmentContents.forEach(fragmentContent => fragment.appendChild(fragmentContent));

	return fragment;
}
