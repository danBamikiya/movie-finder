// TODO:	Find a lighter dom parser. Cheerio is too heavy
import { load } from 'cheerio';
import memoize from '../lib/memoizer';
import { fetchSafeResponse } from '../helpers/fetch';

const cachedFetchSafeImgsUrl = memoize(fetchSafeResponse);

function handleError(error: Error) {
	console.log("Looks like there's a problem: \n", error);
}

function parseResponse(response: { contents: string }): string | undefined {
	const html = response.contents;

	//loading response data into a Cheerio instance
	const $ = load(html);
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
): Promise<string | undefined> {
	if (!actorId.length) return '';

	let scrapedImgSource!: string | undefined;
	const url = `https://www.imdb.com/name/${actorId}/`;

	/**
	 * Make a fetch() request (which by default is a GET HTTP request)
	 * for the imdb page of the actor using a fetch helper function.
	 * This request uses an all origins api to prevent cors error.
	 * The imdb page url is encoded for better parsing by the
	 * api server.
	 * Callbacks to parse the response are also passed to the function.
	 * The scraped image is cached.
	 *
	 * NOTE: This level of caching caches the individual scraped images so
	 * that when a new searched movie has same actors as other previously searched
	 * movies those cached actors images is returned rather than scraping for the
	 * new movie's actors images.
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
