import cheerio from 'cheerio';
import memoize from '../lib/memoizer';
import { fetchSafeResponse } from '../utils/fetch';

const cachedFetchSafeImgsUrl = memoize(fetchSafeResponse);

function handleError(error) {
	console.log(error);
}

function parseResponse(response) {
	const html = response.contents;

	//loading response data into a Cheerio instance
	const $ = cheerio.load(html);
	//selecting the element with the actor's image url
	const scrapedata = $('#name-poster').attr('src');

	//payoff scraped data
	return scrapedata;
}

function readResponseAsJSON(response) {
	return response.json();
}

export async function scrapeWebForActorsImgsUrl(actorId) {
	if (!actorId.length) return '';

	let scrapedImgSource;
	const url = `https://www.imdb.com/name/${actorId}/`;

	/*
		@desc: Make a GET HTTP request for the imdb page of the actor.
				This request uses an all origins api to prevent cors error.
				The imdb page url is encoded for better parsing by the
				api server.
	*/
	try {
		scrapedImgSource = await cachedFetchSafeImgsUrl(
			`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
			[readResponseAsJSON, parseResponse]
		);
	} catch (error) {
		handleError(error);
	}

	return scrapedImgSource;
}
