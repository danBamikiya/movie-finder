import actorNameParser from './actorNameParser';
import scrapeWebForActorsImages from './webScrapper';

function getActorsImgsURL(Movie) {
	const actorsImgsURL = {};
	Promise.all(
		Movie.parsedActorNames.map(async (actorName, index) => {
			actorsImgsURL[
				Movie.cast[index].actor
			] = await scrapeWebForActorsImages(actorName);
		})
	).then((Movie.actorsImgsURL = actorsImgsURL));
}

export default function backgroundActorNamesParse(Movie) {
	const parsedActorNames = Movie.cast
		.map(actor => actor['actor'])
		.reduce(
			(allActorNames, actorName) => [
				...allActorNames,
				actorNameParser(actorName)
			],
			[]
		);
	Movie.parsedActorNames = parsedActorNames;
	getActorsImgsURL(Movie);
}
