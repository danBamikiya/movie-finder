import { ClientTypeError, ClientURIError, ResponseError } from '../lib/errors';

export function handleTypeError(msg: string) {
	throw new ClientTypeError(msg);
}

export function handleURIError(msg: string) {
	throw new ClientURIError(msg);
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
