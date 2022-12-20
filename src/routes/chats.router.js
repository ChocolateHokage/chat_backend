import { Router } from "express";
import { withAuth } from "../modules/index.js";

import {
	createNewChat,
	deleteChat,
	getChatInfo,
	getMyChatsList,
} from "../controllers/chats.controller.js";

import {
	getMessagesFromChat,
	pushNewMessageInChat,
} from "../controllers/messages.controller.js";

import { chatsValidator } from "../validators/index.js";

const chatsRouter = Router();

chatsRouter
	.route("/")
	.get(chatsValidator.getMyChatsList, withAuth, getMyChatsList)
	.post(chatsValidator.createNewChat, withAuth, createNewChat);

chatsRouter
	.route("/:id")
	.get(chatsValidator.getChatInfo, withAuth, getChatInfo)
	.put(withAuth)
	.delete(chatsValidator.deleteChat, withAuth, deleteChat);

chatsRouter
	.route("/:id/messages")
	.get(chatsValidator.getMessagesFromChat, withAuth, getMessagesFromChat)
	.post(withAuth, pushNewMessageInChat)
	.delete(chatsValidator.deleteMessageFromChat, withAuth);

export default chatsRouter;
