import memoize from '../lib/memoizer';
import processHoverCardDocumentFragment from './processFragment';

// The hover card. Moved around the page to where the current hover is
const hoverCardContainer = document.querySelector('.hover-card-container');

const cachedHoverCardDocumentFragment = memoize(
	processHoverCardDocumentFragment
);

let currentTarget;

let activatingElement;

let deactivateTimer;

// The amount of extra time given to move into the content
const deactivateTimeout = 100;

// The minimum time before opening the hovercard via mouseover
const activateTimeout = 250;

// Mouse position for when links wrap lines
let mouseX = 0;

const caretDistanceFromTarget = 12;

/*
	For calculating position of the card when it hangs to the left
	NOTE: These need to stay in sync with certain CSS rules in order to keep the
	caret pointing at the target.
*/

//  caret distance from edge of card
const caretPaddingX = 24;

// Get the content class of a given selector.
// (Prefixes the selector with `hover-card-message--`).
function contentClass(suffix) {
	const contentClassPrefix = 'hover-card-message--';
	return contentClassPrefix + suffix;
}

function hideCard() {
	if (!(hoverCardContainer instanceof HTMLElement)) return;

	hoverCardContainer.style.display = 'none';
	hoverCardContainer.children[0].innerHTML = '';

	activatingElement = null;
	currentTarget = null;
}

function selectRectNearestMouse(target) {
	const rects = target.getClientRects();
	let foundRect = rects[0] ||
		target.getBoundingClientRect() || {
			top: 0,
			left: 0,
			height: 0,
			width: 0
		};

	if (rects.length > 0) {
		for (const rect of rects) {
			if (rect.left < mouseX && rect.right > mouseX) {
				foundRect = rect;
				break;
			}
		}
	}

	return foundRect;
}

function calculatePositions(target) {
	const {
		width: contentWidth,
		height: contentHeight
	} = hoverCardContainer?.getBoundingClientRect();

	const {
		left: targetX,
		top: targetY,
		height: targetHeight,
		width: targetWidth
	} = selectRectNearestMouse(target);

	const roomAbove = targetY > contentHeight;

	/* If there is room, show hovercard above hover position. Else, show it below */
	const roomRight = window.innerHeight - targetX > contentWidth;
	const targetCenterX = targetX + targetWidth / 2;
	const left = roomRight
		? targetCenterX - caretPaddingX
		: targetCenterX - contentWidth + caretPaddingX;
	const top = roomAbove
		? targetY - contentHeight - caretDistanceFromTarget
		: targetY + targetHeight + caretDistanceFromTarget;

	const contentClassSuffix = roomAbove
		? roomRight
			? 'bottom-left'
			: 'bottom-right'
		: roomRight
		? 'top-left'
		: 'top-right';
	return { containerTop: top, containerLeft: left, contentClassSuffix };
}

function positionCard(target, cardContent) {
	if (!(hoverCardContainer instanceof HTMLElement)) return;

	/* Hide container, reset hovercard styles */
	hoverCardContainer.style.visibility = 'hidden';
	hoverCardContainer.style.display = 'block';
	cardContent.classList.remove(
		contentClass('bottom-left'),
		contentClass('bottom-right'),
		contentClass('top-left'),
		contentClass('bottom-right')
	);

	const {
		containerTop,
		containerLeft,
		contentClassSuffix
	} = calculatePositions(target);

	// Add the class for correct caret location
	cardContent.classList.add(contentClass(contentClassSuffix));

	// Position the hovercard & inner message correctly
	hoverCardContainer.style.top = `${containerTop + window.pageYOffset}px`;
	hoverCardContainer.style.left = `${containerLeft + window.pageXOffset}px`;

	// Set z-index override
	setZIndexOverride(target, hoverCardContainer);

	// After positioning correctly, show the hovercard again
	hoverCardContainer.style.visibility = 'initial';
}

function showCard(fragment, target) {
	if (!(hoverCardContainer instanceof HTMLElement)) return;

	const cardContent = hoverCardContainer.children[0];

	cardContent.innerHTML = null; // clear previous hovercard content

	const cardContentBody = document.createElement('div');
	for (const child of fragment.children) {
		cardContentBody.appendChild(child.cloneNode(true));
	}

	cardContent.appendChild(cardContentBody);

	positionCard(target, cardContent);

	hoverCardContainer.style.display = 'block';
}

function hovercardImgUrlFromTarget(target) {
	const hovercardImgUrl = target.getAttribute('data-hovercard-img-url');

	if (hovercardImgUrl) {
		return hovercardImgUrl;
	}
	return '';
}

function actorImdbPageUrlFromTarget(target) {
	const actorImdbPageUrl = target.getAttribute('href');

	if (actorImdbPageUrl) {
		return actorImdbPageUrl;
	}
	return '';
}

function actorNameFromTarget(target) {
	const actorName = target.innerText;

	if (actorName) {
		return actorName;
	}
	return '';
}

// When mousing over a hovercard target, load the data and show the card.
async function activate(event, minimumTimeout) {
	const target = event.currentTarget;

	if (event instanceof MouseEvent) {
		mouseX = event.clientX;
	}

	if (!(target instanceof Element)) return;
	if (currentTarget === target) return;
	if (target.closest('.hover-card-container')) return;

	hideCard();

	// Set the current target as the one we're currently hovering on
	currentTarget = target;
	activatingElement = document.activeElement;

	const hovercardImgUrl = hovercardImgUrlFromTarget(target);
	const actorImdbPage = actorImdbPageUrlFromTarget(target);
	const actorName = actorNameFromTarget(target);

	const forcedDelay = new Promise(resolve =>
		window.setTimeout(resolve, minimumTimeout, 0)
	);
	const fragment = cachedHoverCardDocumentFragment(
		actorName,
		actorImdbPage,
		hovercardImgUrl
	);
	await forcedDelay;

	// Ensure that the target is stll the active one
	if (target === currentTarget) {
		showCard(fragment, target);

		if (
			event instanceof KeyboardEvent &&
			hoverCardContainer instanceof HTMLElement
		) {
			hoverCardContainer.focus();
		}
	}
}

/*  Load the data but don't show until at least `activateTimeout`.
    Only used when loading via mouseover.
*/
function activateWithTimeout(event) {
	activate(event, activateTimeout);
}

/*  When leaving a hovercard, deactivate unless we're moving to another child.
    This allows the user to hover into the content area without dismissing.
*/
function deactivate(event) {
	if (!currentTarget) return;

	if (
		event instanceof MouseEvent &&
		event.relatedTarget instanceof HTMLElement
	) {
		const relatedTarget = event.relatedTarget;
		if (
			relatedTarget.closest('.hover-card-container') ||
			// relatedTarget.closest('') ||
			relatedTarget.closest('[data-hovercard-img-url]')
		) {
			return;
		}
	} else if (
		event instanceof KeyboardEvent &&
		activatingElement instanceof HTMLElement
	) {
		// Return focus to where it was before the card was opened
		activatingElement.focus();
	}

	hideCard();
}

/*  Deactivate after 250ms unless the deactivate timer is canceled as a result
    of the user entering the hovercard content area.
*/
function deactivateWithTimeout(event) {
	const targetWas = currentTarget;

	deactivateTimer = window.setTimeout(() => {
		if (currentTarget === targetWas) deactivate(event);
	}, deactivateTimeout);
}

/*  Triggered when a key is pressed while either a container is focused or
    while inside of an open hovercard.
*/
function handleKeyUp(event) {
	if (!(event instanceof KeyboardEvent)) return;

	if (event.key === 'Escape') deactivate(event);
}

// Cancel the deactivation timer since the user is inside the content now
function cancelDeactivation() {
	if (deactivateTimer) clearTimeout(deactivateTimer);
}

function setZIndexOverride(target, container) {
	const zIndex = target.getAttribute('data-hovercard-z-index-override');
	if (zIndex) {
		container.style.zIndex = zIndex;
	} else {
		// Reset to initial z-index
		container.style.zIndex = '100';
	}
}

export {
	activateWithTimeout,
	deactivateWithTimeout,
	handleKeyUp,
	hideCard,
	cancelDeactivation,
	deactivate
};
