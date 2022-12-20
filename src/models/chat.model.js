import Sequelize from "sequelize";
import { database, encryptor } from "../modules/index.js";

const chatModel = database.define("chat", {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		get() {
			return encryptor.encode(this.getDataValue("id"));
		},
	},
	type: {
		type: Sequelize.ENUM("dialog", "chat"),
		allowNull: false,
		defaultValue: "dialog",
	},
	invite_link: {
		type: Sequelize.STRING,
		allowNull: true,
	},
});

export default chatModel;
