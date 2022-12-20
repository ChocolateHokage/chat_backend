import ApiError from "./apiError.js";
import token from "./token.js";

export default async function (req, res, next) {
	try {
		const auth_header = req.headers.authorization;

		if (!auth_header) {
			next(ApiError.UnauthorizedError());
			return;
		}

		const access_token = auth_header.split(" ")[1];
		if (!access_token) {
			next(ApiError.UnauthorizedError());
			return;
		}

		const user_data = token.validateAccessToken(access_token);
		if (!user_data) {
			next(ApiError.UnauthorizedError());
			return;
		}

		req.user = user_data;
		next();
	} catch (error) {
		next(ApiError.UnauthorizedError());
	}
}
