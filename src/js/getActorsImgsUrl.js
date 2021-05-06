import actorNameParser from './actorNameParser';
import scrapeWebForActorsImages from './webScrapper';

function backgroundActorNamesParse(movieCast) {
	movieCast.forEach(
		actor => (actor['parsedActorName'] = actorNameParser(actor['actor']))
	);
}

export default function getActorsImgsURL({ cast: movieCast }) {
	backgroundActorNamesParse(movieCast);

	movieCast.forEach(
		async actor =>
			(actor['actorImgURL'] = await scrapeWebForActorsImages(
				actor['parsedActorName']
			))
	);
}
