abstract class ClientError extends Error {
	readonly name: string;

	constructor(message: object | string) {
		super(message instanceof Object ? JSON.stringify(message) : message);

		this.name = this.constructor.name;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

export class ClientTypeError extends ClientError {
	constructor(message: string | object = 'Type Error') {
		super(message);
	}
}

export class ClientURIError extends ClientError {
	constructor(message: string | object = 'Malformed URI sequence') {
		super(message);
	}
}

export class ResponseError extends Error {
	response: Response;

	constructor(response: Response) {
		super();
		this.response = response;
	}
}
