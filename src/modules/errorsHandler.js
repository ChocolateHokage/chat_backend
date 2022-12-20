import { ValidationError } from "express-validation";
import multer from "multer";
import Sequelize from "sequelize";
import ApiError from "./apiError.js";
import { logger } from "./index.js";

export default function (error, req, res, next) {
	if (error instanceof ApiError) {
		res.status(error.status).json({ msg: error.message, data: error.errors });
		return;
	}

	if (error instanceof multer.MulterError) {
		logger.error(error);

		res.status(500).json({
			msg: "Error on uploading files. Contact the administrator or try again later.",
			data: {
				code: error?.code || error?.statusCode || 2,
				date: new Date().toString(),
			},
		});
		return;
	}

	if (error?.name == "SequelizeValidationError") {
		logger.error(error);

		const messages = [];

		error.errors.forEach((e) => messages.push(e.message));

		res.status(400).json({
			msg: messages.length
				? messages
				: "Error when checking the received data. Try to enter the correct data or contact the administrator.",
			data: {
				code: error?.code || error?.statusCode || 3,
				date: new Date().toString(),
			},
		});
		return;
	}

	if (error instanceof ValidationError) {
		logger.error(error);

		const messages = [];

		error.details.forEach((e) => {
			for (const i in e) messages.push(e[i]);
		});

		return res.status(error.statusCode).json({
			msg: messages.length
				? messages
				: "Error when checking the received data. Try to enter the correct data or contact the administrator.",
			data: {
				code: error?.code || error?.statusCode || 4,
				date: new Date().toString(),
			},
		});
	}

	const { query, params, body, headers, cookies } = req;

	logger.error(error);
	logger.error(JSON.stringify({ query, params, body, cookies, headers }, null, 2));

	res.status(error?.statusCode || 500).json({
		msg: "Something went wrong. Contact the administrator or try again later.",
		data: {
			code: error?.code || error?.statusCode || 1,
			date: new Date().toString(),
		},
	});
}
