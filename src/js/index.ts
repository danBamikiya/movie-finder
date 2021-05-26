import { Movie } from './types';
import getMovie from './actions/getMovie';
import appendMoviePosterToDOM from './ui/appendMoviePosterToDOM';
import appendMovieDetailsToDOM from './ui/appendMovieDetailsToDOM';
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
const Movie = <Movie>{};

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

function showMovie(movie: Movie) {
	Movie.title = movie['title'].trim();
	Movie.year = movie['year'];
	Movie.length = movie['length'];
	Movie.rating = movie['rating'];
	Movie.poster = movie['poster'];
	Movie.plot = movie['plot'];
	Movie.cast = movie['cast'];

	setActorsImgsUrl(Movie);
	appendMoviePosterToDOM(AppendToDOMDependencies);
	appendMovieDetailsToDOM(AppendToDOMDependencies);
}

function submitValue(e: MouseEvent) {
	e.preventDefault();
	// get input field value
	let txtValue = inputTxt.value;
	getMovie(txtValue, showMovie);
	// clear input field
	inputTxt.value = '';
}

submitBtn!.addEventListener('click', submitValue);
