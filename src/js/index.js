import getMovie from './getMovie.js';
import scrapeWebForActorsImages from './webScrapper.js';

const submitBtn = document.getElementById('submitBtn');
const inputTxt = document.getElementById('inputTxt');
const moviePosterContainer = document.getElementsByClassName(
	'movie-poster-container'
)[0];
const moviePosterDetailsContainer = moviePosterContainer.nextElementSibling;
const canvasElement = document.getElementsByTagName('canvas')[0];

const title_paragraph = document.createElement('p');
const year_paragraph = document.createElement('p');
const length_paragraph = document.createElement('p');
const rating_paragraph = document.createElement('p');
const plot_paragraph = document.createElement('p');

const posterImg = document.createElement('img');
const posterDetails = document.createElement('div');
posterDetails.className = 'poster-details';
const div = document.createElement('div');
div.className = 'movie-poster-details';

const Movie = {}; // refactor here

function outputResponse(movie) {
	Movie.title = movie['title'];
	Movie.year = movie['year'];
	Movie.length = movie['length'];
	Movie.rating = movie['rating'];
	Movie.poster = movie['poster'];
	Movie.plot = movie['plot'];
	Movie.cast = movie['cast'];

	backgroundActorNamesParse();
	appendMovieToDOM();
	startRecognition();
}

function appendMovieToDOM() {
	moviePosterContainer.innerHTML = ''; // refactor
	posterImg.src = Movie.poster;
	posterImg.alt = 'a movie poster';
	posterImg.className = 'movie-poster';
	moviePosterContainer.appendChild(posterImg);

	appendMovieDetailsToDOM();
}

function appendMovieDetailsToDOM() {
	posterDetails.innerHTML = ''; //refactor

	const details = document.createElement('p');
	details.className = 'details-header';
	details.innerHTML = 'Details';

	const cast = document.createElement('p');
	cast.className = 'cast-header';
	cast.innerHTML = 'Cast';

	const detailsDiv = document.createElement('div');
	detailsDiv.className = 'detailsDiv';
	detailsDiv.appendChild(details);

	const castDiv = document.createElement('div');
	castDiv.className = 'castDiv';
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
				plot_paragraph.innerHTML = `${key}: ${Movie[key]}`;
				plot_paragraph.id = 'plot-paragraph';
				detailsDiv.appendChild(plot_paragraph);
				break;
			default:
				break;
		}
	}

	posterDetails.appendChild(detailsDiv);

	Movie.cast.forEach(actor => {
		const paragraph = document.createElement('p');
		paragraph.appendChild(
			document.createTextNode(
				`${actor['actor']} as ${actor['character']}`
			)
		);
		castDiv.appendChild(paragraph);
	});

	posterDetails.appendChild(castDiv);

	moviePosterDetailsContainer.appendChild(posterDetails);
}

function submitValue(e) {
	e.preventDefault();
	// get input field value
	let txtValue = inputTxt.value;
	getMovie(txtValue);
	// clear input field
	inputTxt.value = '';
}

submitBtn.addEventListener('click', submitValue);

function startRecognition() {
	// Load models
	Promise.all([
		faceapi.nets.faceRecognitionNet.loadFromUri('../models'),
		faceapi.nets.faceLandmark68Net.loadFromUri('../models'),
		faceapi.nets.ssdMobilenetv1.loadFromUri('../models')
	]).then(start);
}

async function start() {
	/** detect faces and draw detected faces with thier corresponding names to the DOM **/

	const LabeledFaceDescriptors = await loadLabeledImages();
	console.log(LabeledFaceDescriptors);
	// const faceMatcher = new faceapi.faceMatcher(LabeledFaceDescriptors, 0.6);
	// const image = await faceapi.fetchImage(Movie.poster);
	// /* Preparing the overlay canvas */
	// // creating canvas from the image
	// const canvas = faceapi.createCanvasFromMedia(posterImg);
	// moviePosterContainer.append(canvas);
	// // resize the overlay canvas to the image dimensions
	// const displaySize = { width: posterImg.width, height: posterImg.height };
	// faceapi.matchDimensions(canvas, displaySize);
	// const detections = await faceapi
	// 	.detectAllFaces(image)
	// 	.withFaceLandmarks()
	// 	.withFaceDescriptors();
	// // console.log(detections.length);
	// const resizedDetections = faceapi.resizeResults(detections, displaySize);
	// const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));
	// results.forEach((result, i) => {
	// 	const box = resizedDetections[i].detection.box;
	// 	// draw detectedface
	// 	const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() });
	// 	drawBox.draw(canvas);
	// });
}

async function backgroundActorNamesParse() {
	const parsedActorNames = Movie.cast
		.map(actor => actor['actor'])
		.reduce(
			(allActorNames, actorName) => [
				...allActorNames,
				actorNameParser(actorName)
			],
			[]
		);
	Movie.parsedActorNames = parsedActorNames;
}

async function loadLabeledImages() {
	// refactor this
	const allLabeledFaceDescriptors = [];
	// return Promise.all(
	for await (const actorName of Movie.parsedActorNames) {
		const descriptions = [];
		const imgUrl = await scrapeWebForActorsImages(actorName);
		console.log(`${actorName} - Done: ${imgUrl}`);
		const img = await faceapi.fetchImage(`${imgUrl}`);
		console.log(img);

		// const detections = await faceapi
		// 	.detectSingleFace(img)
		// 	.withFaceLandmarks()
		// 	.withFaceDescriptor();
		// descriptions.push(detections.descriptor);
		// console.log(descriptions);
		// allLabeledFaceDescriptors.push(
		// allLabeledFaceDescriptors.push(
		// 	new faceapi.LabeledFaceDescriptors(actorName, descriptions)
		// );
		// );
	}
	console.log(`Done => ${allLabeledFaceDescriptors}`);
	// // );

	// return Promise.all(
	// 	await Movie.parsedActorNames.map(async actorName => {
	// 		const descriptions = [];
	// 		const imgUrl = await scrapeWebForActorsImages(actorName);
	// 		console.log(`${actorName} - Done: ${imgUrl}`);
	// 		const img = await faceapi.fetchImage(`${imgUrl}`);
	// 		const detections = await faceapi
	// 			.detectSingleFace(img)
	// 			.withFaceLandmarks()
	// 			.withFaceDescriptor();
	// 		descriptions.push(detections.descriptor);
	// 		return new faceapi.LabeledFaceDescriptors(actorName, descriptions);
	// 	})
	// );
}

function actorNameParser(actor) {
	/** Regex to parse actors name */
	const regexParser = /([^\W])([\w]+)/gi;
	const result = actor.match(regexParser);
	let parsedName = '';
	result.forEach(name => {
		parsedName += `${name}+`;
	});
	const name = parsedName.slice(0, -1);
	const casedName = name.toLowerCase();
	return casedName;
}

export { outputResponse };
