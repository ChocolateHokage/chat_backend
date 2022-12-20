export default class ApiError extends Error {
	constructor(status, message, errors = []) {
		super(message);

		this.status = status;
		this.message = message;
		this.errors = errors;
	}

	static UnauthorizedError() {
		return new this(401, "Not authorized");
	}

	static BadRequest(message, errors = []) {
		if (
			typeof message === "string" &&
			typeof errors === "object" &&
			Array.isArray(errors)
		)
			return new this(400, message, errors);
		else throw new Error("Invalid type");
	}

	static Forbidden() {
		return new this(403, "Access denied");
	}

	static NotFound(message) {
		if (typeof message === "string") return new this(404, message);
		else throw new Error("Invalid type");
	}
}
