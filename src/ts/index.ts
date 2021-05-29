import { Movie } from './types';
import { Elements } from './base';
import getMovie from './actions/getMovie';
import renderMovie from './ui/Movie';
import initHoverCard from './ui/HoverCard';
import setActorsImgsUrl from './actions/setActorsImgsUrl';

// Temporary state of the app
/*
  - Current movie object
*/
let Movie = <Movie>{};

function showMovie(searchTxt: string) {
	getMovie(searchTxt).then(results => {
		if (!results) throw new Error('Movie not found');
		Movie = { ...results };
	});

	if (!Object.keys(Movie).length) return;
	setActorsImgsUrl(Movie);
	renderMovie(Movie);
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
