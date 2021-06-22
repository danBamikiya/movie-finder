import { memoize } from '../lib';
import { Actor, Movie } from '../types';
import { scrapeActorImgUrl } from './scrapeImage';
import { useActorImgUrl } from '../hooks/useActorImgUrl';

const cachedFetchSafeResponse = memoize(scrapeActorImgUrl);

async function fetchActorImgUrl(actor: Actor, index: number) {
	// Cache the individual scraped images
	actor['actorImgURL'] = await cachedFetchSafeResponse(actor['actor_id']);

	useActorImgUrl(actor.actorImgURL, index);
}

export function setActorsImgsUrl({ cast: movieCast }: Movie) {
	movieCast.forEach(fetchActorImgUrl);
}
