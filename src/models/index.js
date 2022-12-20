import { database } from "../modules/index.js";

import sessionModel from "./session.model.js";
import authenticationModel from "./authentication.model.js";
import chatModel from "./chat.model.js";
import accountModel from "./account.model.js";
import messageModel from "./message.model.js";
import fileModel from "./file.model.js";
import attachmentModel from "./attachment.model.js";

/* 
one account has one auth 
*/
accountModel.hasOne(authenticationModel);
authenticationModel.belongsTo(accountModel);

/* 
one account has many session 
*/
accountModel.hasMany(sessionModel);
sessionModel.belongsTo(accountModel);

/* 
many account has many chat 
*/
const chatsAccountsModel = database.define(
	"chats_accounts",
	{},
	{ timestamps: false },
);
accountModel.belongsToMany(chatModel, {
	through: chatsAccountsModel,
});
chatModel.belongsToMany(accountModel, {
	through: chatsAccountsModel,
});
accountModel.hasMany(chatsAccountsModel);
chatsAccountsModel.belongsTo(accountModel);
chatModel.hasMany(chatsAccountsModel);
chatsAccountsModel.belongsTo(chatModel);

/* 
one image has one account 
*/
fileModel.belongsTo(accountModel);
accountModel.hasOne(fileModel);

/* 
many messages has one account 
*/
messageModel.belongsTo(accountModel);
accountModel.hasOne(messageModel);

/*
many messages has one chat 
*/
messageModel.belongsTo(chatModel);
chatModel.hasMany(messageModel);

/*
one message has many attachments 
*/
messageModel.hasMany(attachmentModel)
attachmentModel.belongsTo(messageModel)

export {
	chatsAccountsModel,
	sessionModel,
	authenticationModel,
	chatModel,
	accountModel,
	messageModel,
	fileModel,
	attachmentModel,
};
