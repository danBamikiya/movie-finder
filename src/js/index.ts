import { Movie } from './types';
import getMovie from './actions/getMovie';
import renderMovie from './ui/Movie';
import setActorsImgsUrl from './actions/setActorsImgsUrl';

const submitBtn = document.getElementById('submitBtn');
const inputTxt = document.getElementById('inputTxt') as HTMLInputElement;

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
	const searchTxt = inputTxt.value;

	// check for movie name in input field
	if (!searchTxt.length) return;

	showMovie(searchTxt);
	// clear input field
	inputTxt.value = '';
}

submitBtn!.addEventListener('click', submitValue);
