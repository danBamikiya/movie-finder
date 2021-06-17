// TODO:	Find a lighter dom parser. Cheerio is too heavy
import { load } from 'cheerio';
import { memoize } from '../lib';
import { scrapeWeb } from '../utils';

const cachedFetchSafeResponse = memoize(scrapeWeb);

function parseResponse(response: { contents: string }): string | undefined {
	const html = response.contents;

	//loading response data into a Cheerio instance
	const $ = load(html);
	//selecting the element with the actor's image url
	const scrapedata = $('#name-poster').attr('src');

	//payoff scraped data
	return scrapedata;
}

export async function scrapeActorImgUrl(
	actorId: string
): Promise<string | undefined> {
	if (!actorId.length) return '';

	const url = `https://www.imdb.com/name/${actorId}/`;

	/**
	 * Fetch the imdb page of the actor using a webScrapper utility function.
	 * Callbacks to parse the response are also passed to the function.
	 * The scraped image url is cached.
	 *
	 * NOTE: This level of caching caches the individual scraped images so
	 * that when a new searched movie has same actors as other previously searched
	 * movies those cached actors images is returned rather than scraping for the
	 * new movie's actors images.
	 */

	return await cachedFetchSafeResponse(url, parseResponse);
}
