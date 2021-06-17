import { Movie, Actor } from '../../types';

export function movieDetailsRenderer(
	div: HTMLElement,
	{ title, year, length, rating, plot, cast: movieCast }: Movie
): HTMLElement {
	const movieDetailsContainer = div.cloneNode() as HTMLElement;
	movieDetailsContainer.className = 'movie-details-container';

	const p = document.createElement('p');

	const movieDetails = div.cloneNode() as HTMLElement;
	movieDetails.className = 'movie-details';

	const detailsHeader = p.cloneNode() as HTMLElement;
	detailsHeader.className = 'details-header';
	detailsHeader.innerHTML = 'Details';

	const castHeader = p.cloneNode() as HTMLElement;
	castHeader.className = 'cast-header';
	castHeader.innerHTML = 'Cast';

	const detailsParent = div.cloneNode() as HTMLElement;
	detailsParent.className = 'details';
	detailsParent.appendChild(detailsHeader);

	const castParent = div.cloneNode() as HTMLElement;
	castParent.className = 'cast';
	castParent.appendChild(castHeader);

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

	movieDetails.appendChild(detailsParent);

	const createActorName = (actor: Actor) => {
		const actorRole = p.cloneNode() as HTMLElement;
		const actorName = document.createElement('a');
		actorName.className = 'actor-name';
		actorName.href = `https://www.imdb.com/name/${actor['actor_id']}/`;
		actorName.target = '_blank';
		actorName.innerText = `${actor['actor']}`;
		actorRole.insertAdjacentElement('afterbegin', actorName);
		actorName.insertAdjacentText('afterend', ` as ${actor['character']}`);

		castParent.appendChild(actorRole);
	};

	movieCast.forEach(createActorName);

	movieDetails.appendChild(castParent);

	movieDetailsContainer.appendChild(movieDetails);

	return movieDetailsContainer;
}
