import { Elements } from './dom';
import { isEmptyObject } from './utils';
import { renderMovie } from './ui/Movie';
import { initHoverCard } from './ui/HoverCard';
import { getMovie, setActorsImgsUrl } from './actions';

import '../styles/index.css';

async function showMovie(searchTxt: string) {
	const Movie = await getMovie(searchTxt);
	if (!Movie || isEmptyObject(Movie)) {
		console.log('Movie not found');
		return;
	}

	await renderMovie(Movie);
	setActorsImgsUrl(Movie);
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
