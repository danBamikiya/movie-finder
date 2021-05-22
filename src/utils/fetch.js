import { validateResponse, ResponseError } from '../lib/errorhandler';
import { isFunction, isArray, arrayOrFunction } from './utils';

/**
 *
 * @desc This creates the request object to be used by
 * the fetch() request
 *
 */

function makeRequest(url, options) {
	const opts = options ? Object.assign({}, options) : {};
	const request = new Request(url, opts);
	return request;
}

/**
 *
 * @desc	This is a simple implementation of Promise.then() where there
 * is an array of callbacks and each callback is called on the value
 * of the previous callback.
 * The value of the final callback is returned.
 *
 */

async function invokeCallbacks(response, callbacks) {
	let value = response;

	for (const callback of callbacks) {
		if (!isFunction(callback)) return;
		value = await callback(value);
	}

	return value;
}

/**
 *
 * @desc This checks if the callback is an array of callbacks and
 * invokes them on the response or if the single callback is a function
 * and invokes it on the response.
 * The initial response is returned if there's no callback.
 */

function publishCallback(response, callback) {
	const child = isArray(callback);

	if (child) {
		return invokeCallbacks(response, callback);
	} else if (isFunction(callback)) {
		return callback(response);
	}

	return response;
}

/**
 *
 * @desc This instantiates a custom Error object on the
 * Response object gotten from the fetch() request (because
 * the browser's fetch api won’t reject on HTTP error
 * status even if the response is an HTTP 404 or 500)
 * and verify's that Error object then calls the passed
 * callback(s) on the Response object
 */

function parseResponse(response, callback) {
	const responseError = new ResponseError(response);

	validateResponse(response, responseError);

	return publishCallback(response, callback);
}

export async function fetchSafeResponse(url, options, callback) {
	if (!url) return;

	let response, safeResponse;

	if (!callback && arrayOrFunction(options)) {
		const callback = options;
		response = await self.fetch(makeRequest(url));
		safeResponse = parseResponse(response, callback);
	} else {
		response = await self.fetch(makeRequest(url, options));
		safeResponse = parseResponse(response, callback);
	}

	return safeResponse;
}
