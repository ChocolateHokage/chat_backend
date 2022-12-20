import { Joi, validate } from "express-validation";

const v = (schema) =>
	validate(schema, { keyByField: true });

export default {
	login: v(
		{
			body: Joi.object().keys({
				email: Joi.string().email().required(),
				password: Joi.string().min(5).max(24).required(),
			}),
		}
	),
};
