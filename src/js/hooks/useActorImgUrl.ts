export default function useActorImgURL(url: string, index: number) {
	const actors = Array.from(document.getElementsByClassName('actor-name'));

	if (!actors.length) return;

	if (!(actors[index] instanceof HTMLAnchorElement)) return;

	actors[index].setAttribute('data-hovercard-img-url', `${url ?? ''}`);
}
