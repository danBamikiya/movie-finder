import { Movie } from '../types';

type AppendParams = {
	Movie: Movie;
	posterDetails: HTMLDivElement;
	moviePosterDetailsContainer: Element;
	title_paragraph: HTMLParagraphElement;
	year_paragraph: HTMLParagraphElement;
	length_paragraph: HTMLParagraphElement;
	rating_paragraph: HTMLParagraphElement;
	plot_paragraph: HTMLParagraphElement;
};

export default function appendMovieDetailsToDOM({
	Movie,
	posterDetails,
	moviePosterDetailsContainer,
	title_paragraph,
	year_paragraph,
	length_paragraph,
	rating_paragraph,
	plot_paragraph
}: AppendParams) {
	posterDetails.innerHTML = ''; // clear previous poster details

	const details = document.createElement('p');
	details.className = 'details-header';
	details.innerHTML = 'Details';

	const cast = document.createElement('p');
	cast.className = 'cast-header';
	cast.innerHTML = 'Cast';

	const detailsDiv = document.createElement('div');
	detailsDiv.className = 'details-div';
	detailsDiv.appendChild(details);

	const castDiv = document.createElement('div');
	castDiv.className = 'cast-div';
	castDiv.appendChild(cast);

	for (const key in Movie) {
		switch (key) {
			case 'title':
				title_paragraph.innerHTML = `${key}: ${Movie[key]}`;
				title_paragraph.id = 'title-paragraph';
				detailsDiv.appendChild(title_paragraph);
				break;
			case 'year':
				year_paragraph.innerHTML = `${key}: ${Movie[key]}`;
				year_paragraph.id = 'year-paragraph';
				detailsDiv.appendChild(year_paragraph);
				break;
			case 'length':
				length_paragraph.innerHTML = `${key}: ${Movie[key]}`;
				length_paragraph.id = 'length-paragraph';
				detailsDiv.appendChild(length_paragraph);
				break;
			case 'rating':
				rating_paragraph.innerHTML = `${key}: ${Movie[key]}`;
				rating_paragraph.id = 'rating-paragraph';
				detailsDiv.appendChild(rating_paragraph);
				break;
			case 'plot':
				plot_paragraph.innerHTML = `${key}: <p>${Movie[key]}</p>`;
				plot_paragraph.id = 'plot-paragraph';
				detailsDiv.appendChild(plot_paragraph);
				break;
			default:
				break;
		}
	}

	posterDetails.appendChild(detailsDiv);

	Movie.cast.forEach(actor => {
		const actorRole = document.createElement('p');
		const actorName = document.createElement('a');
		actorName.className = 'actor-name';
		actorName.href = `https://www.imdb.com/name/${actor['actor_id']}/`;
		actorName.target = '_blank';
		actorName.innerText = `${actor['actor']}`;
		actorRole.insertAdjacentElement('afterbegin', actorName);
		actorName.insertAdjacentText('afterend', ` as ${actor['character']}`);

		castDiv.appendChild(actorRole);
	});

	posterDetails.appendChild(castDiv);

	moviePosterDetailsContainer.appendChild(posterDetails);
}
