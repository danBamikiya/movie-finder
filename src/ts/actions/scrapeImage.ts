// TODO:	Find a lighter dom parser. Cheerio is too heavy
import { load } from 'cheerio';
import { scrapeWeb } from '../utils';

function parseResponse(response: { contents: string }): string | undefined {
	const html = response.contents;

	//loading response data into a Cheerio instance
	const $ = load(html);
	//selecting the element with the actor's image url
	const scrapedata = $('#name-poster').attr('src');

	return scrapedata;
}

export async function scrapeActorImgUrl(
	actorId: string
): Promise<string | undefined> {
	if (!actorId.length) return '';

	const url = `https://www.imdb.com/name/${actorId}/`;
	return await scrapeWeb(url, parseResponse);
}
