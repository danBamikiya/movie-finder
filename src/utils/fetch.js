import { validateResponse, ResponseError } from '../lib/errorhandler';
import { isFunction } from './utils';

function makeRequest(url, options) {
	const opts = options ? Object.assign({}, options) : {};
	const request = new Request(url, opts);
	return request;
}

function invokeCallbacks(response, callbacks) {
	let value = response;

	for (const callback of callbacks) {
		if (!isFunction(callback)) return;
		value = callback(value);
	}

	return value;
}

function publishCallback(response, callback) {
	const child = Array.isArray(callback);

	if (child) {
		return invokeCallbacks(response, callback);
	} else if (isFunction(callback)) {
		return callback(response);
	}

	return;
}

export async function fetchSafeResponse(url, options, callback) {
	const response = await self.fetch(makeRequest(url, options));
	const responseError = new ResponseError(response);

	validateResponse(response, responseError);

	const safeResponse = publishCallback(response, callback);

	return safeResponse;
}
