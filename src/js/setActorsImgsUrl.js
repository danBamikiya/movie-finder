import { scrapeWebForActorsImgsUrl } from './webScrapper';
import useActorImgURL from './useActorImgURL';

async function fetchActorImgUrl(actor, index) {
	actor['actorImgURL'] = await scrapeWebForActorsImgsUrl(actor['actor_id']);

	useActorImgURL(actor.actorImgURL, index);
}

export default function setActorsImgsUrl({ cast: movieCast }) {
	movieCast.forEach(fetchActorImgUrl);
}
