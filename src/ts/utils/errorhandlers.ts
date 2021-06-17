import { ResponseError } from '../lib';

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
