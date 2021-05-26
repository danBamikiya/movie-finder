import cheerio from 'cheerio';
import memoize from '../lib/memoizer';
import { fetchSafeResponse } from '../helpers/fetch';
import { handleURIError } from '../utils/errorhandlers';

const cachedFetchSafeImgsUrl = memoize(fetchSafeResponse);

function handleError(error: Error) {
	if (error instanceof URIError) handleURIError();
	else console.log(error);
}

function parseResponse(response: { contents: string }): string | undefined {
	const html = response.contents;

	//loading response data into a Cheerio instance
	const $ = cheerio.load(html);
	//selecting the element with the actor's image url
	const scrapedata = $('#name-poster').attr('src');

	//payoff scraped data
	return scrapedata;
}

function readResponseAsJSON(response: Response): Promise<any> {
	return response.json();
}

export async function scrapeWebForActorsImgsUrl(
	actorId: string
): Promise<string> {
	if (!actorId.length) return '';

	let scrapedImgSource;
	const url = `https://www.imdb.com/name/${actorId}/`;

	/**
	 * Make a GET HTTP request for the imdb page of the actor.
	 * This request uses an all origins api to prevent cors error.
	 * The imdb page url is encoded for better parsing by the
	 * api server.
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
