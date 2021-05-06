export default function startRecognition({
	Movie,
	posterImg,
	moviePosterContainer
}) {
	// Load models
	Promise.all([
		faceapi.nets.faceRecognitionNet.loadFromUri('../models'),
		faceapi.nets.faceLandmark68Net.loadFromUri('../models'),
		faceapi.nets.ssdMobilenetv1.loadFromUri('../models')
	]).then(
		startWhenActorsImgsURLIsReady(Movie, posterImg, moviePosterContainer)
	);
}

function startWhenActorsImgsURLIsReady(Movie, posterImg, moviePosterContainer) {
	const urlIsReady = actor => actor['actorImgURL'] !== undefined;

	if (Movie.cast.every(urlIsReady)) {
		start(Movie, posterImg, moviePosterContainer);
	} else {
		setTimeout(() => {
			start(Movie, posterImg, moviePosterContainer);
		}, 10000);
	}
}

async function start(Movie, posterImg, moviePosterContainer) {
	/** detect faces and draw detected faces with thier corresponding names to the DOM **/
	const LabeledFaceDescriptors = await loadLabeledImages(Movie);
	if (!LabeledFaceDescriptors?.length) {
		throw new Error('No labeled images found');
	}
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
	const resizedDetections = faceapi.resizeResults(detections, displaySize);

	const results = resizedDetections.map(detections =>
		faceMatcher.findBestMatch(detections.descriptor)
	);
	results.forEach((result, index) => {
		const box = resizedDetections[index].detection.box;
		// draw detectedface
		const drawBox = new faceapi.draw.DrawBox(box, {
			label: result.toString()
		});
		drawBox.draw(canvas);
	});
}

function loadLabeledImages(Movie) {
	console.log(Movie);
	return Promise.all(
		Movie.cast.map(async ({ actorImgURL, actor: actorName }) => {
			const descriptions = [];

			if (actorImgURL === undefined) {
				descriptions.push('');
			} else {
				const img = await faceapi.fetchImage(`${actorImgURL}`);
				const detections = await faceapi
					.detectSingleFace(img)
					.withFaceLandmarks()
					.withFaceDescriptor();
				descriptions.push(detections.descriptor);
			}

			return new faceapi.LabeledFaceDescriptors(actorName, descriptions);
		})
	);
}
