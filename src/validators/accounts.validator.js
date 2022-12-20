import { Joi, validate } from "express-validation";

const v = (schema) =>
	validate(schema, { keyByField: true });

export default {
	createAccount: v({
		body: Joi.object({
			username: Joi.string().min(3).max(16).required(),
			email: Joi.string().email().required(),
			password: Joi.string().min(5).max(24).required(),
		}),
	}),
	getAllAccounts: v({
		query: Joi.object({
			offset: Joi.number().integer().min(0),
			limit: Joi.number().integer().min(0),
		}),
	}),
	getOneAccount: v({
		params: Joi.object({
			id: Joi.string().required(),
		}),
	}),
};
