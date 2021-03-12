import getMovie from './getMovie';
import appendMovieToDOM from './appendMovieToDOM';
import appendMovieDetailsToDOM from './appendMovieDetailsToDOM';
import backgroundActorNamesParse from './getActorsImgsUrl';

const submitBtn = document.getElementById('submitBtn');
const inputTxt = document.getElementById('inputTxt');
const moviePosterContainer = document.getElementsByClassName(
	'movie-poster-container'
)[0];
const moviePosterDetailsContainer = moviePosterContainer.nextElementSibling;
const canvasElement = document.getElementsByTagName('canvas')[0];

const posterImg = document.createElement('img');
const posterDetails = document.createElement('div');
posterDetails.className = 'poster-details';
const div = document.createElement('div');
div.className = 'movie-poster-details';

const Movie = {};

const AppendToDOMDependencies = {
	Movie,
	posterDetails,
	moviePosterDetailsContainer,
	moviePosterContainer,
	posterImg,
	title_paragraph: document.createElement('p'),
	year_paragraph: document.createElement('p'),
	length_paragraph: document.createElement('p'),
	rating_paragraph: document.createElement('p'),
	plot_paragraph: document.createElement('p')
};

function outputResponse(movie) {
	Movie.title = movie['title'];
	Movie.year = movie['year'];
	Movie.length = movie['length'];
	Movie.rating = movie['rating'];
	Movie.poster = movie['poster'];
	Movie.plot = movie['plot'];
	Movie.cast = movie['cast'];

	backgroundActorNamesParse(Movie);
	appendMovieToDOM(AppendToDOMDependencies);
	appendMovieDetailsToDOM(AppendToDOMDependencies);
	startRecognition();
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
	const faceMatcher = new faceapi.FaceMatcher(LabeledFaceDescriptors, 0.6);
	const image = await faceapi.fetchImage(Movie.poster);
	/* Preparing the overlay canvas */

	// creating canvas from the image
	const canvas = faceapi.createCanvasFromMedia(posterImg);
	moviePosterContainer.append(canvas);
	// resize the overlay canvas to the image dimensions
	const displaySize = { width: posterImg.width, height: posterImg.height };
	faceapi.matchDimensions(canvas, displaySize);
	const detections = await faceapi
		.detectAllFaces(image)
		.withFaceLandmarks()
		.withFaceDescriptors();
	// console.log(detections.length);
	const resizedDetections = faceapi.resizeResults(detections, displaySize);
	const results = resizedDetections.map(d =>
		faceMatcher.findBestMatch(d.descriptor)
	);
	results.forEach((result, i) => {
		const box = resizedDetections[i].detection.box;
		// draw detectedface
		const drawBox = new faceapi.draw.DrawBox(box, {
			label: result.toString()
		});
		drawBox.draw(canvas);
	});
}

function loadLabeledImages() {
	// refactor this
	// const allLabeledFaceDescriptors = [];
	// return Promise.all(
	// for await (const actorName of Movie.parsedActorNames) {
	// 	const descriptions = [];
	// 	const imgUrl = await scrapeWebForActorsImages(actorName);
	// 	console.log(`${actorName} - Done: ${imgUrl}`);
	// 	const img = await faceapi.fetchImage(`${imgUrl}`);
	// 	const detections = await faceapi
	// 		.detectSingleFace(img)
	// 		.withFaceLandmarks()
	// 		.withFaceDescriptor();
	// 	descriptions.push(detections.descriptor);
	// 	console.log(descriptions);
	// 	allLabeledFaceDescriptors.push(
	// 		new faceapi.LabeledFaceDescriptors(actorName, descriptions)
	// 	);
	// }
	// console.log(`Done => ${allLabeledFaceDescriptors}`);
	// // );
	return Promise.all(
		Movie.actorsImgsURL.map(async imgUrl => {
			const descriptions = [];
			console.log('Initializing');
			const img = await faceapi.fetchImage(`${imgUrl}`);
			console.log(img);
			const detections = await faceapi
				.detectSingleFace(img)
				.withFaceLandmarks()
				.withFaceDescriptor();
			descriptions.push(detections.descriptor);
			return new faceapi.LabeledFaceDescriptors(actorName, descriptions);
		})
	);
}

export { outputResponse };
