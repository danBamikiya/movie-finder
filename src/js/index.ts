import { Movie } from './types';
import getMovie from './actions/getMovie';
import appendMoviePosterToDOM from './ui/Movie/appendMoviePosterToDOM';
import appendMovieDetailsToDOM from './ui/Movie/appendMovieDetailsToDOM';
import setActorsImgsUrl from './actions/setActorsImgsUrl';

const submitBtn = document.getElementById('submitBtn');
const inputTxt = document.getElementById('inputTxt') as HTMLInputElement;

const moviePosterContainer = document.getElementsByClassName(
	'movie-poster-container'
)[0];
const moviePosterDetailsContainer = document.getElementsByClassName(
	'movie-poster-details-container'
)[0];

const posterDetails = document.createElement('div');
posterDetails.className = 'poster-details';

// The global state of the app
let Movie = <Movie>{};

const AppendToDOMDependencies = {
	Movie,
	posterDetails,
	moviePosterDetailsContainer,
	moviePosterContainer,
	posterImg: new Image(),
	title_paragraph: document.createElement('p'),
	year_paragraph: document.createElement('p'),
	length_paragraph: document.createElement('p'),
	rating_paragraph: document.createElement('p'),
	plot_paragraph: document.createElement('p')
};

function showMovie(searchTxt: string) {
	getMovie(searchTxt).then(results => {
		if (!results) throw new Error('Movie not found');
		Movie = { ...results };
	});

	setActorsImgsUrl(Movie);
	appendMoviePosterToDOM(AppendToDOMDependencies);
	appendMovieDetailsToDOM(AppendToDOMDependencies);
}

function submitValue(e: MouseEvent) {
	e.preventDefault();
	// check for movie name in input field
	if (!inputTxt.value.length) return;

	showMovie(inputTxt.value);
	// clear input field
	inputTxt.value = '';
}

submitBtn!.addEventListener('click', submitValue);
