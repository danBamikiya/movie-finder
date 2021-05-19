import actorNameParser from './actorNameParser';
import scrapeWebForActorsImages from './webScrapper';
import useActorImgURL from './useActorImgURL';

function parseActorsNames(movieCast) {
	movieCast.forEach(
		actor => (actor['parsedActorName'] = actorNameParser(actor['actor']))
	);
}

async function fetchActorImgUrl(actor, index) {
	actor['actorImgURL'] = await scrapeWebForActorsImages(
		actor['parsedActorName']
	);

	useActorImgURL(actor.actorImgURL, index);
}

export default function setActorsImgsUrl({ cast: movieCast }) {
	parseActorsNames(movieCast);

	movieCast.forEach(fetchActorImgUrl);
}
