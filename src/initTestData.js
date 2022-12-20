import {
	accountModel,
	chatModel,
	chatsAccountsModel,
	messageModel,
} from "./models/index.js";
import { logger } from "./modules/index.js";

const testAccounts = [
	{ email: "test@mail.ru", username: "test user" },
	{ email: "test@yandex.ru", username: "another test user" },
	{ email: "admin@gmail.com", username: "test admin" },
];

const testChats = [{ type: "dialog" }, { type: "dialog" }, { type: "dialog" }];

const testMessages = [
	{ chatId: 1, text: "-_-", accountId: 3 },
	{ chatId: 1, text: "hello", accountId: 1 },
	{ chatId: 3, text: "hello", accountId: 3 },
	{ chatId: 2, text: "Миау", accountId: 3, unread: false },
];

export default async function () {
	try {
		await accountModel.bulkCreate(testAccounts);
		logger.debug(`accounts inserted`);

		await chatModel.bulkCreate(testChats);
		await chatsAccountsModel.bulkCreate([
			{ accountId: 1, chatId: 1 },
			{ accountId: 3, chatId: 1 },
			{ accountId: 1, chatId: 2 },
			{ accountId: 2, chatId: 2 },
			{ accountId: 2, chatId: 3 },
			{ accountId: 3, chatId: 3 },
		]);
		logger.debug(`chats inserted`);

		await messageModel.bulkCreate(testMessages);
		logger.debug(`messages inserted`);
	} catch (error) {
		logger.error(error);
	}
}
