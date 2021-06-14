export class ResponseError extends Error {
	response: Response;

	constructor(response: Response) {
		super();
		this.response = response;
	}
}
