export default function appendMoviePosterToDOM({
	Movie,
	moviePosterContainer,
	posterImg
}) {
	moviePosterContainer.innerHTML = null; // clear previous poster
	posterImg.src = Movie.poster;
	posterImg.alt = 'a movie poster';
	posterImg.className = 'movie-poster';
	posterImg.crossOrigin = 'anonymous';
	moviePosterContainer.appendChild(posterImg);
}
