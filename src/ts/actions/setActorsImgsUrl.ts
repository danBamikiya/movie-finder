import { Actor, Movie } from '../types';
import { scrapeActorImgUrl } from './scrapeImage';
import { useActorImgUrl } from '../hooks/useActorImgUrl';

async function fetchActorImgUrl(actor: Actor, index: number) {
	actor['actorImgURL'] = await scrapeActorImgUrl(actor['actor_id']);

	useActorImgUrl(actor.actorImgURL, index);
}

export function setActorsImgsUrl({ cast: movieCast }: Movie) {
	movieCast.forEach(fetchActorImgUrl);
}
