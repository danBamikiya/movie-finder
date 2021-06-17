export function processFragment(fragmentContent: HTMLElement): DocumentFragment {
	const fragment = new DocumentFragment();

	fragment.appendChild(fragmentContent);

	return fragment;
}
