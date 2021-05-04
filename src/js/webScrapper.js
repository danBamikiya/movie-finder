import axios from 'axios';
import cheerio from 'cheerio';

let clearerImgSource;

// make a GET HTTP request to an imdb search of the actor
export default async function scrapeWebForActorsImages(actor) {
	await axios
		.get(
			`https://api.allorigins.win/get?url=${encodeURIComponent(
				`https://www.imdb.com/find?q=${actor}&ref_=nv_sr_sm/`
			)}`
		)
		.then(async response => {
			//handling the success
			const html = response.data.contents;
			//loading response data into a Cheerio instance
			const $ = cheerio.load(html);
			//selecting the element with the actors image
			const scrapedImgSource = $('td.primary_photo')
				.children()
				.first()
				.attr('href');

			// call another function to scrape the href location for a clearer image
			await getClearerImage(scrapedImgSource);
		})
		//handling error
		.catch(error => {
			console.log(error);
		});
	return clearerImgSource;
}

async function getClearerImage(scrapedHref) {
	// make a GET HTTP request to an imdb page with the actors image
	await axios
		.get(
			`https://api.allorigins.win/get?url=${encodeURIComponent(
				`https://www.imdb.com${scrapedHref}/`
			)}`
		)
		.then(response => {
			//handling the success
			const html = response.data.contents;
			//loading response data into a Cheerio instance
			const $ = cheerio.load(html);
			//selecting the element with the actors image
			const scrapedata = $('#name-poster').attr('src');

			//payoff scraped data
			clearerImgSource = scrapedata;
		})
		//handling error
		.catch(error => {
			console.log(error);
		});
}
