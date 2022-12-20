import Sequelize from "sequelize";
import { database, encryptor } from "../modules/index.js";

const messageModel = database.define("message", {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		get() {
			return encryptor.encode(this.getDataValue("id"));
		},
	},
	text: {
		type: Sequelize.TEXT,
		allowNull: true,
	},
	unread: {
		type: Sequelize.BOOLEAN,
		defaultValue: true,
		allowNull: false,
	},
	accountId: {
		type: Sequelize.INTEGER,
		allowNull: false,
		get() {
			return encryptor.encode(this.getDataValue("id"));
		},
	},
	chatId: {
		type: Sequelize.INTEGER,
		allowNull: false,
		get() {
			return encryptor.encode(this.getDataValue("id"));
		},
	},
	type: {
		type: Sequelize.ENUM("simple", "audio"),
		allowNull: false,
		defaultValue: "simple",
	},
});

export default messageModel;
