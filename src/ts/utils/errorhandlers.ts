import { ClientTypeError, ClientURIError, ResponseError } from '../lib/errors';

export function handleTypeError() {
	throw new ClientTypeError("Looks like there's a Type Error");
}

export function handleURIError() {
	throw new ClientURIError("Looks like there's a URI Error");
}

export function checkStatus(response: Response, responseError: ResponseError) {
	// handles response as success when the status code
	// is in the range 200 - 299
	if (response.ok) {
		return response;
	}

	const statusText = response.statusText ? ` ${response.statusText}` : '';
	responseError.message = `HTTP ${response.status}${statusText}`;
	throw responseError;
}
