import actorNameParser from './actorNameParser';
import scrapeWebForActorsImages from './webScrapper';

function getActorsImgsURL(movieCast) {
	movieCast.forEach(
		async actor =>
			(actor['actorImgURL'] = await scrapeWebForActorsImages(
				actor['parsedActorName']
			))
	);
}

export default function backgroundActorNamesParse({ cast: movieCast }) {
	movieCast.forEach(
		actor => (actor['parsedActorName'] = actorNameParser(actor['actor']))
	);
	getActorsImgsURL(movieCast);
}
