import { scrapeWebForActorsImgsUrl } from './webScrapper';
import { Actor, Movie } from '../types';
import useActorImgURL from '../hooks/useActorImgURL';

async function fetchActorImgUrl(actor: Actor, index: number) {
	try {
		actor['actorImgURL'] = await scrapeWebForActorsImgsUrl(actor['actor_id']);

		useActorImgURL(actor.actorImgURL, index);
	} catch (error) {
		console.log(error);
	}
}

export default function setActorsImgsUrl({ cast: movieCast }: Movie) {
	movieCast.forEach(fetchActorImgUrl);
}
