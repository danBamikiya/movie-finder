export default function useActorsImgsUrlWhenReady({ cast: movieCast }) {
	// let minimumTimeout = 2000;

	const urlIsReady = actor => actor['actorImgURL'] !== undefined;

	// refactor here with recursion
	if (movieCast.every(urlIsReady)) {
		useActorsImgsURL(Movie);
	} else {
		setTimeout(() => {
			useActorsImgsURL(Movie);
		}, 10000);
	}
}

function useActorsImgsURL(cast) {
	const actors = Array.from(document.getElementsByClassName('actor-name'));

	if (!actors.length) return;

	actors.forEach((actor, index) => {
		if (!(actor instanceof HTMLAnchorElement)) return;

		actor.setAttribute(
			'data-hovercard-img-url',
			`${cast[index].actorImgURL}`
		);
	});
}
