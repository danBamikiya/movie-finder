// TODO:	Find a lighter dom parser. Cheerio is too heavy
import { load } from 'cheerio';
import { scrapeWeb, isArray } from '../utils';
import { ScrapedVideoData } from '../types';

function getVideoData(
	parsedData: ScrapedVideoData[]
): ScrapedVideoData | undefined {
	if (isArray(parsedData)) {
		// Try our best to prefer 480p video resolution
		const data = parsedData.find(
			videoData => videoData['definition'] === '480p'
		);
		return data ? data : parsedData[parsedData.length - 1];
	}

	return;
}

function parseResponse(response: {
	contents: string;
}): ScrapedVideoData | undefined {
	const html = response.contents;

	//loading response data into a Cheerio instance
	const $ = load(html);
	//selecting the element with the trailer video url
	const scrapedData = $('body script:eq(11)').html();
	const parseRegex = /(\[\{)\\"definition\\"(.+)\\"\}\]/gi;
	const parsedDataMatchArray = scrapedData?.match(parseRegex);

	if (parsedDataMatchArray) {
		let parsedData = parsedDataMatchArray[parsedDataMatchArray.length - 1];
		parsedData = parsedData.replace(/\\/g, '');

		return JSON.parse(parsedData);
	}

	return;
}

export async function scrapeMovieTrailer(
	trailerID: string
): Promise<ScrapedVideoData | undefined> {
	if (!trailerID.length) return;

	const url = `https://www.imdb.com/video/${trailerID}/`;
	return await scrapeWeb(url, parseResponse, getVideoData);
}
