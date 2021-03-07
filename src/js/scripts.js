// import libraries
import axios from 'axios';
import cheerio from 'cheerio';

// make a GET HTTP request to an imdb search of the actor

async function scrapeWebForActorsImages(actor) {
	axios
		.get(
			`https://api.allorigins.win/get?url=${encodeURIComponent(
				`https://www.imdb.com/find?q=${actor}&ref_=nv_sr_sm/`
			)}`
		)
		.then(response => {
			//handling the success
			const html = response.data.contents;
			//loading response data into a Cheerio instance
			const $ = cheerio.load(html);
			//selecting the elements with the actors image
			const scrapedata = $('td.primary_photo').children().first().attr('href');

			//outputting the scraped data
			console.log(scrapedata);
			// call another function to scrape the href location for a clearer image
			return getClearerImage(scrapedata);
		})
		//handling error
		.catch(error => {
			console.log(error);
		});
}

function getClearerImage(scrapedHref) {
	// make a GET HTTP request to an imdb page with the actors image
	axios
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
			//selecting the elements with the actors image
			const scrapedata = $('#name-poster').attr('src');

			//outputting the scraped data
			console.log(scrapedata);

			// return scraped data
			return scrapedata;
		})
		//handling error
		.catch(error => {
			console.log(error);
		});
}

export default scrapeWebForActorsImages;
