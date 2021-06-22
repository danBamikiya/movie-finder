// Lightweight TC39 observable Subscription
class Subscription {
	closed: boolean; // Indicates whether the subscription is closed.
	unsubscribe: () => void; // Cancels the subscription.

	constructor(cleanup: () => void) {
		this.closed = false;
		this.unsubscribe = () => {
			cleanup();
			this.closed = true;
		};
	}
}

// Create a Subscription from an event
export function fromEvent(
	target: EventTarget,
	eventName: string,
	listener: EventListenerOrEventListenerObject,
	options: AddEventListenerOptions = { capture: false }
) {
	target.addEventListener(eventName, listener, options);
	const cleanup = () =>
		target.removeEventListener(eventName, listener, options);
	return new Subscription(cleanup);
}

// Combine several subscriptions into a single subscription
export function compose(...subscriptions: Subscription[]): Subscription {
	const cleanupAll = () => {
		for (const subscription of subscriptions) {
			subscription.unsubscribe();
		}
	};
	return new Subscription(cleanupAll);
}
