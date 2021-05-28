import { Movie } from '../../types';

type AppendParams = {
	Movie: Movie;
	moviePosterContainer: Element;
	posterImg: HTMLImageElement;
};

export default function appendMoviePosterToDOM({
	Movie,
	moviePosterContainer,
	posterImg
}: AppendParams) {
	moviePosterContainer.innerHTML = ''; // clear previous poster
	posterImg.crossOrigin = 'anonymous';
	posterImg.src = Movie.poster;
	posterImg.alt = 'a movie poster';
	posterImg.className = 'movie-poster';
	moviePosterContainer.appendChild(posterImg);
}
