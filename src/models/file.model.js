import Sequelize from "sequelize";
import { database, encryptor } from "../modules/index.js";

const fileModel = database.define(
	"file",
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			get() {
				return encryptor.encode(this.getDataValue("id"));
			},
		},
		type: {
			type: Sequelize.ENUM("image", "video", "audio", "file"),
			allowNull: false,
		},
		url: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				isUrl: true,
			},
		},
		accountId: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
	},
	{ updatedAt: false },
);

export default fileModel;
