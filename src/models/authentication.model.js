import { Sequelize } from "sequelize";
import { database, hasher } from "../modules/index.js";

const authenticationModel = database.define("authentication", {
	password: {
		type: Sequelize.TEXT,
		allowNull: false,
		validate: {
			notNull: {
				msg: "Password required",
			},
		},
		set(val) {
			this.setDataValue("password", hasher(val));
		},
	},
	accountId: { type: Sequelize.INTEGER, allowNull: false },
});

export default authenticationModel;
