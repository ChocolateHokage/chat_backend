import { Sequelize } from "sequelize";
import { database } from "../modules/index.js";

const sessionModel = database.define(
	"session",
	{
		hash: { type: Sequelize.TEXT, allowNull: false },
		ip: {
			type: Sequelize.STRING,
			validate: {
				isIPv4: true,
			},
		},
		accountId: {
			type: Sequelize.INTEGER,
			allowNull: false,
		},
	},
	{ updatedAt: false },
);

export default sessionModel;
