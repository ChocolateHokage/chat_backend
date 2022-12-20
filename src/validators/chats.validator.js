import { Joi, validate } from "express-validation";

const v = (schema) => validate(schema, { keyByField: true });

export default {
	createNewChat: v({
		body: Joi.object({
			type: Joi.string().case("lower").default("dialog"),
			// .equal(["dialog", "chat"])
			accountId: Joi.string().required(),
		}),
	}),
	getMyChatsList: v({
		query: Joi.object({
			offset: Joi.number().integer().min(0),
			limit: Joi.number().integer().min(0),
		}),
	}),
	getChatInfo: v({
		params: Joi.object({
			id: Joi.string().required(),
		}),
	}),
	deleteChat: v({
		params: Joi.object({
			id: Joi.string().required(),
		}),
	}),
	getMessagesFromChat: v({
		params: Joi.object({
			id: Joi.string().required(),
		}),
	}),
	deleteMessageFromChat: v({
		params: Joi.object({
			id: Joi.string().required(),
		}),
	}),
};
