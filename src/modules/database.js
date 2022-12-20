import { Sequelize } from "sequelize";

const user = process.env.DB_USER ?? "",
	password = process.env.DB_PASSWORD ?? "",
	database = process.env.DB_NAME ?? "",
	host = process.env.DB_HOST ?? "localhost";

export default new Sequelize(database, user, password, {
	host,
	dialect: "mysql",
	logging: false,
});
