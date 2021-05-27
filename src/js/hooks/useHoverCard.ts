import { observe } from 'selector-observer';
import { compose, fromEvent } from '../lib/subscription';

import {
	activateWithTimeout,
	deactivateWithTimeout,
	handleKeyUp,
	currentTarget,
	hideCard,
	cancelDeactivation,
	deactivate
} from '../ui/HoverCard/hoverCard';

(function () {
	// The hover card. Moved around the page to where the current hover is
	const hoverCardContainer = document.querySelector('.hover-card-container');

	if (hoverCardContainer) {
		observe('[data-hovercard-img-url]', {
			subscribe: element =>
				compose(
					fromEvent(element, 'mouseover', activateWithTimeout),
					fromEvent(element, 'mouseleave', deactivateWithTimeout),
					fromEvent(element, 'keyup', handleKeyUp)
				)
		});

		observe('[data-hovercard-img-url]', {
			remove(element) {
				// Hide card if the element that triggered it is being removed
				if (currentTarget === element) hideCard();
			}
		});

		observe('.hover-card-container', {
			subscribe: element =>
				compose(
					fromEvent(element, 'mouseover', cancelDeactivation),
					fromEvent(element, 'mouseleave', deactivate),
					fromEvent(element, 'keyup', handleKeyUp)
				)
		});
	}
})();
