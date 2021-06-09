import { scrapeWebForActorsImgsUrl } from './webScrapper';
import { Actor, Movie } from '../types';
import useActorImgUrl from '../hooks/useActorImgUrl';

async function fetchActorImgUrl(actor: Actor, index: number) {
	try {
		actor['actorImgURL'] = await scrapeWebForActorsImgsUrl(actor['actor_id']);

		useActorImgUrl(actor.actorImgURL, index);
	} catch (error) {
		console.log(error);
	}
}

export default function setActorsImgsUrl({ cast: movieCast }: Movie) {
	movieCast.forEach(fetchActorImgUrl);
}
