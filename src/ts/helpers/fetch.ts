import { ResponseError } from '../lib/errors';
import { checkStatus, handleTypeError } from '../utils/errorhandlers';
import { Callback } from '../types';
import { isFunction } from '../utils';

/**
 *
 * This creates the request object to be used by
 * the fetch() request
 */

function makeRequest(url: RequestInfo, options?: RequestInit): Request {
	const opts = options ? Object.assign({}, options) : {};
	return new Request(url, opts);
}

/**
 *
 * This is a simple implementation of Promise.then() where there
 * is an array of callbacks and each callback is called on the value
 * of the previous callback.
 * The value of the final callback value is returned.
 */

async function invokeCallbacks(response: Response, callbacks: Callback[]) {
	let value = response;

	try {
		for (const callback of callbacks) {
			if (!isFunction(callback)) return;
			value = await callback(value);
		}
	} catch (error) {
		if (error instanceof TypeError) handleTypeError(error.message);
		else throw error;
	}

	return value;
}

/**
 *
 * This checks if the callback is an array of callbacks and
 * invokes them on the response or if the single callback is a function
 * and invokes it on the response.
 * The initial response is returned if there's no callback.
 */

function publishCallback(response: Response, callback: Callback | Callback[]) {
	if (Array.isArray(callback)) {
		return invokeCallbacks(response, callback);
	} else if (isFunction(callback)) {
		return callback(response);
	}

	return response;
}

/**
 *
 * This instantiates a custom Error object on the
 * Response object gotten from the fetch() request (because
 * the browser's fetch api won’t reject on HTTP error
 * status even if the response is an HTTP 404 or 500)
 * and verify's that Error object then calls the passed
 * callback(s) on the Response object
 */

function parseResponse(response: Response, callback: Callback | Callback[]) {
	const responseError = new ResponseError(response);
	checkStatus(response, responseError);

	return publishCallback(response, callback);
}

export async function fetchSafeResponse(
	url: RequestInfo,
	callback: Callback | Callback[],
	options?: RequestInit
): Promise<any> {
	if (!url) return;

	const response = await self.fetch(makeRequest(url, options));
	return parseResponse(response, callback);
}
