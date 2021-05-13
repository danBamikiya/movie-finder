//INFO: An alternative to this module - RxJS

// Lightweight TC39 observable Subscription
class Subscription {
	constructor(cleanup) {
		this.closed = false; // indicates whether the subscription is closed
		this.unsubscribe = () => {
			// cancels the subscription
			cleanup();
			this.closed = true;
		};
	}
}

// Create a Subscription from an event
export function fromEvent(target, eventName, listener, options) {
	target.addEventListener(eventName, listener, options);
	const cleanup = () =>
		target.removeEventListener(eventName, listener, options);
	return new Subscription(cleanup);
}

// Combine several subscriptions into a single subscription
export function compose(...subscriptions) {
	const cleanupAll = () => {
		for (const subscription of subscriptions) {
			subscription.unsubscribe();
		}
	};
	return new Subscription(cleanupAll);
}
