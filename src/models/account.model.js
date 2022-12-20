import { Sequelize } from "sequelize";
import { database, encryptor } from "../modules/index.js";

const accountModel = database.define("account", {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		get() {
			return encryptor.encode(this.getDataValue("id"));
		},
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notNull: {
				msg: "Email required",
			},
			isEmail: {
				msg: "Email is not valid",
			},
			notEmpty: {
				msg: "Email cannot be empty",
			},
		},
	},
	username: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notNull: {
				msg: "Username required",
			},
			notEmpty: {
				msg: "The username cannot be empty",
			},
			len: [3, 20],
		},
	},
	avatar_url: {
		type: Sequelize.STRING,
		validate: {
			notEmpty: true,
			isUrl: true,
		},
	},
}, {
	indexes: [
		{ unique: true, fields: ['email'] },
		{ unique: true, fields: ['username'] }
	]
});

export default accountModel;
