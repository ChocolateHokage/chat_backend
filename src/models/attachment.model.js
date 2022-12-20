import { Sequelize } from "sequelize";
import { database, encryptor } from "../modules/index.js";

const attachmentModel = database.define("attachment", {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		get() {
			return encryptor.encode(this.getDataValue("id"));
		},
	},
	type: {
		type: Sequelize.ENUM("message", "file"),
		allowNull: false,
	},
	messageId: {
		type: Sequelize.INTEGER,
		allowNull: false,
		get() {
			return encryptor.encode(this.getDataValue("messageId"))
		}
	},
	payloadId: {
		type: Sequelize.INTEGER,
		allowNull: false,
		comment: "id of message or file",
	},
});

export default attachmentModel;
