import {
	accountModel,
	attachmentModel,
	chatModel,
	messageModel,
	fileModel,
} from "../models/index.js";
import { ApiError, encryptor, socket } from "../modules/index.js";
import { Op } from "sequelize"

export const getMessagesFromChat = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { offset, limit } = req.query;
		const self = req.user;

		const chat = await chatModel.findOne({
			where: { id: encryptor.decode(id) },
			include: { model: accountModel, as: "accounts", attributes: ["id"] },
		});

		if (!chat) {
			next(ApiError.NotFound("Chat not found"));
			return;
		}

		const member = chat.accounts.find(
			(a) => a.getDataValue("id") == encryptor.decode(self.id),
		);

		if (!member) {
			next(ApiError.Forbidden());
			return;
		}

		const messages = await messageModel.findAll({
			where: {
				chatId: chat.getDataValue("id"),
			},
			include: [accountModel, attachmentModel],
			offset: offset ?? 0,
			limit: limit ?? 12,
			order: [["createdAt", "DESC"]]
		});


		for (const index in messages) {
			let lol = messages[index].getDataValue("attachments").map(i => i.payloadId)
			if (lol.length) {
				messages[index].setDataValue("attachments", await fileModel.findAll({
					where: {
						id: {
							[Op.in]: lol
						}
					}
				}))
			}
		}

		const messages_count = await messageModel.count({
			where: {
				chatId: chat.getDataValue("id"),
			}
		})

		res.status(messages_count ? 200 : 204).json({ count: messages_count, rows: messages });
		req.socket.emit("SERVER:MESSAGE_READED", { count: messages_count, rows: messages })
	} catch (error) {
		next(error);
	}
};

export const pushNewMessageInChat = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { type, text, attachments } = req.body;
		const self = req.user;

		const chat = await chatModel.findOne({
			where: { id: encryptor.decode(id) },
			include: { model: accountModel, as: "accounts", attributes: ["id"] },
		});

		if (!chat) {
			next(ApiError.NotFound("Chat not found"));
			return;
		}

		const member = chat.accounts.find(
			(a) => a.getDataValue("id") == encryptor.decode(self.id),
		);

		if (!member) {
			next(ApiError.Forbidden());
			return;
		}

		switch (type) {
			case "simple": {
				const message = await messageModel.create({
					text,
					accountId: encryptor.decode(self.id),
					chatId: chat.getDataValue("id"),
					type,
				});
				try {
					if (attachments?.length) {
						await attachmentModel.bulkCreate(
							attachments.map((a) => ({
								type: a.type,
								messageId: message.getDataValue("id"),
								payloadId: encryptor.decode(a.payloadId),
							}))
						);
					}
				} catch (error) {
					await message.destroy()
					throw (error)
				}

				res.status(201).json(message);
				req.socket.emit("SERVER:NEW_MESSAGE", message)
				return;
			}
			case "audio": {
				res.status(503).send("In development");
				req.socket.emit("SERVER:NEW_MESSAGE", message)
				return;
			}
			default: {
				next(ApiError.BadRequest("Incorrent type"));
				return;
			}
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
};
