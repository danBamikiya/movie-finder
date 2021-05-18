export default function appendMoviePosterToDOM({
	Movie,
	moviePosterContainer,
	posterImg
}) {
	moviePosterContainer.innerHTML = null; // clear previous poster
	posterImg.crossOrigin = 'anonymous';
	posterImg.src = Movie.poster;
	posterImg.alt = 'a movie poster';
	posterImg.className = 'movie-poster';
	moviePosterContainer.appendChild(posterImg);
}
