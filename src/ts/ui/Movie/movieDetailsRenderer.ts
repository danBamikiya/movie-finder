import { Movie } from '../../types';

export default function movieDetailsRenderer(
	div: HTMLElement,
	{ title, year, length, rating, plot, cast: movieCast }: Movie
): HTMLElement {
	const moviePosterDetailsContainer = div.cloneNode() as HTMLElement;
	moviePosterDetailsContainer.className = 'movie-poster-details-container';

	const p = document.createElement('p');

	const posterDetails = div.cloneNode() as HTMLElement;
	posterDetails.className = 'poster-details';

	const details = p.cloneNode() as HTMLElement;
	details.className = 'details-header';
	details.innerHTML = 'Details';

	const cast = p.cloneNode() as HTMLElement;
	cast.className = 'cast-header';
	cast.innerHTML = 'Cast';

	const detailsParent = div.cloneNode() as HTMLElement;
	detailsParent.className = 'details-div';
	detailsParent.appendChild(details);

	const castParent = div.cloneNode() as HTMLElement;
	castParent.className = 'cast-div';
	castParent.appendChild(cast);

	const title_paragraph = p.cloneNode() as HTMLElement;
	title_paragraph.innerHTML = `Title: ${title}`;
	title_paragraph.id = 'title-paragraph';
	detailsParent.appendChild(title_paragraph);

	const year_paragraph = p.cloneNode() as HTMLElement;
	year_paragraph.innerHTML = `Year: ${year}`;
	year_paragraph.id = 'year-paragraph';
	detailsParent.appendChild(year_paragraph);

	const length_paragraph = p.cloneNode() as HTMLElement;
	length_paragraph.innerHTML = `Length: ${length}`;
	length_paragraph.id = 'length-paragraph';
	detailsParent.appendChild(length_paragraph);

	const rating_paragraph = p.cloneNode() as HTMLElement;
	rating_paragraph.innerHTML = `Rating: ${rating}`;
	rating_paragraph.id = 'rating-paragraph';
	detailsParent.appendChild(rating_paragraph);

	const plot_paragraph = p.cloneNode() as HTMLElement;
	plot_paragraph.innerHTML = `Plot: <p>${plot}</p>`;
	plot_paragraph.id = 'plot-paragraph';
	detailsParent.appendChild(plot_paragraph);

	posterDetails.appendChild(detailsParent);

	movieCast.forEach(actor => {
		const actorRole = p.cloneNode() as HTMLElement;
		const actorName = document.createElement('a');
		actorName.className = 'actor-name';
		actorName.href = `https://www.imdb.com/name/${actor['actor_id']}/`;
		actorName.target = '_blank';
		actorName.innerText = `${actor['actor']}`;
		actorRole.insertAdjacentElement('afterbegin', actorName);
		actorName.insertAdjacentText('afterend', ` as ${actor['character']}`);

		castParent.appendChild(actorRole);
	});

	posterDetails.appendChild(castParent);

	moviePosterDetailsContainer.appendChild(posterDetails);

	return moviePosterDetailsContainer;
}
