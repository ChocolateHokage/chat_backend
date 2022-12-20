import { Op } from "sequelize";
import {
	accountModel,
	chatModel,
	chatsAccountsModel,
	messageModel,
} from "../models/index.js";
import { ApiError, encryptor } from "../modules/index.js";

export const getMyChatsList = async (req, res, next) => {
	try {
		const { offset, limit } = req.query;
		const self = req.user;

		const chatsList = await chatsAccountsModel.findAndCountAll({
			where: {
				accountId: encryptor.decode(self.id),
			},
			offset: Number(offset ?? 0),
			limit: Number(limit ?? 12),
		});

		if (chatsList.count > 0) {
			chatsList.rows = await chatModel.findAll({
				include: [
					{
						model: accountModel,
						as: "accounts",
						attributes: ["id", "username", "avatar_url"],
					},
				],
				where: {
					id: {
						[Op.in]: chatsList.rows.map((i) => i.chatId),
					},
				},
			});

			for (const ind in chatsList.rows) {
				chatsList.rows[ind].setDataValue(
					"unread_count",
					await messageModel.count({
						where: {
							chatId: chatsList.rows[ind].getDataValue("id"),
							unread: true,
						},
					}),
				);
				chatsList.rows[ind].setDataValue(
					"message",
					await messageModel.findOne({
						where: { chatId: chatsList.rows[ind].getDataValue("id") },
						include: [accountModel],
						order: [["createdAt", "DESC"]],
					}),
				);
			}
		}

		res.status(chatsList.count > 0 ? 200 : 204).json(chatsList);
	} catch (error) {
		next(error);
	}
};

export const getChatInfo = async (req, res, next) => {
	try {
		const { id } = req.params;

		const chat = await chatModel.findByPk(id, {
			include: [
				{
					model: accountModel,
					as: "accounts",
					attributes: ["id", "username", "avatar_url"],
				},
			],
		});

		res.status(chat?.getDataValue("id") ? 200 : 204).json(chat);
	} catch (error) {
		next(error);
	}
};

export const createNewChat = async (req, res, next) => {
	try {
		const { type, accountId } = req.body;
		const self = req.user;
		const target = await accountModel.findOne({
			where: { id: encryptor.decode(accountId) },
		});

		if (target && encryptor.decode(self.id) == target.getDataValue("id")) {
			next(ApiError.BadRequest("You can't create a dialogue with yourself"));
			return;
		}

		switch (type) {
			case "dialog": {
				let chat_accounts = await chatsAccountsModel.findAll({
					where: {
						accountId: [encryptor.decode(self.id), target.getDataValue("id")],
					},
				});

				for (const x in chat_accounts) {
					const test = chat_accounts.find(
						(ca) =>
							ca.chatId == chat_accounts[x].chatId &&
							ca.accountId != chat_accounts[x].accountId,
					);
					if (test) {
						next(ApiError.BadRequest("Already exist"));
						return;
					}
				}

				const chat = await chatModel.create({ type });
				await chatsAccountsModel.bulkCreate([
					{
						chatId: chat.getDataValue("id"),
						accountId: target.getDataValue("id"),
					},
					{
						chatId: chat.getDataValue("id"),
						accountId: encryptor.decode(self.id),
					},
				]);

				res.status(201).json(chat);
				return;
			}

			default: {
				next(ApiError.BadRequest("Incorrect type"));
				return;
			}
		}
	} catch (error) {
		next(error);
	}
};

export const deleteChat = async (req, res, next) => {
	try {
		const { id } = req.params;
		const self = req.user;

		const chat = await chatModel.findOne({
			where: {
				id: encryptor.decode(id),
			},
			include: [
				{
					model: accountModel,
					as: "accounts",
					attributes: ["id", "username", "avatar_url"],
				},
			],
		});

		if (!chat) {
			next(ApiError.NotFound("Chat not found"));
			return;
		}

		if (chat.getDataValue("type") === "dialog") {
			const member = chat.accounts.find(
				(a) => a.getDataValue("id") == encryptor.decode(self.id),
			);
			if (!member) {
				next(ApiError.Forbidden());
				return;
			}

			await chat.destroy();
		} else if (chat.getDataValue("type") === "chat") {
			res.status(503).send("In development");
			return;
		}

		res.sendStatus(200);
	} catch (error) {
		next(error);
	}
};
