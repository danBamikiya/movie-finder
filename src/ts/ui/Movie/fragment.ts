export default function fragment(fragmentContents: HTMLElement[]): DocumentFragment {
	const fragment = new DocumentFragment();

	for (const fragmentContent of fragmentContents) {
		fragment.appendChild(fragmentContent);
	}

	return fragment;
}
