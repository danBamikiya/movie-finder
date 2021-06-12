import { Elements } from './base';
import getMovie from './actions/getMovie';
import renderMovie from './ui/Movie';
import initHoverCard from './ui/HoverCard';
import setActorsImgsUrl from './actions/setActorsImgsUrl';

import '../styles/index.css';

function showMovie(searchTxt: string) {
	getMovie(searchTxt).then(Movie => {
		if (!Movie || !Object.keys(Movie).length) {
			console.log('Movie not found');
			return;
		}

		/**
		 * HACK: The webscraping is set off before rendering of the movie ui because
		 * the actors imgs url are all scraped asynchronously(in parallel) so by the
		 * time any has finished scraping, the ui will have rendered and the scraped
		 * img url will be set as data-attributes to the corresponding dom elements
		 * having the actor's name.
		 */
		setActorsImgsUrl(Movie);
		renderMovie(Movie);
	});
}

function submitValue(e: MouseEvent) {
	e.preventDefault();
	const searchTxt = Elements.inputTxt.value;

	// check for movie name in input field
	if (!searchTxt.length) return;

	showMovie(searchTxt);
	// clear input field
	Elements.inputTxt.value = '';
}

function initApp() {
	Elements.submitBtn!.addEventListener('click', submitValue);
}

function start() {
	initApp();
	initHoverCard();
}

// Init On DOM Load
document.addEventListener('DOMContentLoaded', start);
