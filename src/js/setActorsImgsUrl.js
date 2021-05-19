import actorNameParser from './actorNameParser';
import scrapeWebForActorsImages from './webScrapper';

function parseActorsNames(movieCast) {
	movieCast.forEach(
		actor => (actor['parsedActorName'] = actorNameParser(actor['actor']))
	);
}

export default function getActorsImgsUrl({ cast: movieCast }) {
	parseActorsNames(movieCast);

	movieCast.forEach(
		async actor =>
			(actor['actorImgURL'] = await scrapeWebForActorsImages(
				actor['parsedActorName']
			))
	);
}
