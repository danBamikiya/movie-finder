export class ResponseError extends Error {
	response;

	constructor(response) {
		super();
		this.response = response;
	}
}

export function validateResponse(response, responseError) {
	// handles response as success when the status code
	// is in the range 200 - 299
	if (response.ok) {
		return response;
	}

	const statusText = response.statusText ? ` ${response.statusText}` : '';
	responseError.message = `HTTP ${response.status}${statusText}`;
	throw responseError;
}
