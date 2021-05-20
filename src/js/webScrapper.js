import cheerio from 'cheerio';

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

/*
	@desc: This validates the HTTP response of the fetch request
			because fetch() won’t reject on HTTP error status
			even if the response is an HTTP 404 or 500.
			It resolves normally with `ok` set to false.
*/
function validateResponse(response) {
	if (!response.ok) {
		throw Error(response.statusText);
	}
	return response;
}

export async function scrapeWebForActorsImages(actorId) {
	if (!actorId.length) return '';

	const url = `https://www.imdb.com/name/${actorId}/`;

	/*
		@desc: Make a GET HTTP request for the imdb page of the actor.
				This request uses an all origins api to prevent cors error.
				The imdb page url is encoded for better parsing by the
				api server.
	*/
	const scrapedImgSource = await fetch(
		`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
	)
		.then(validateResponse)
		.then(readResponseAsJSON)
		.then(parseResponse)
		.catch(handleError);

	return scrapedImgSource;
}
