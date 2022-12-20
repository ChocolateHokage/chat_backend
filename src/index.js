import express from "express";
import "dotenv/config";
import compression from "compression";
import rateLimit from "express-rate-limit";
import cors from "cors";
import path from "path";
import { expressSharp, FsAdapter } from "express-sharp";
import http from 'http'

import { logger, config, database, errorsHandler, socket } from "./modules/index.js";
import router from "./routes/index.js";
// import initTestData from "./initTestData.js";
import cookieParser from "cookie-parser";

const PORT = Number(process.env.PORT ?? 4000);

const app = express();
const server = http.createServer(app)
const io = socket(server)

app
	.use(express.json())
	.use(cookieParser())
	.use(compression())
	.use(cors(config.corsConfig))
	.use(rateLimit(config.rateLimitOptions))
	.use(`/api/v${config.version}/static`, express.static(path.resolve("static")))
	.use(
		`/api/v${config.version}/static/images`,
		expressSharp({
			imageAdapter: new FsAdapter(path.resolve("static", "uploads")),
		}),
	)
	.use((req, res, next) => {
		req.socket = io
		next()
	})
	.use(`/api/v${config.version}`, router)
	.use(errorsHandler);

server.listen(PORT, () => {
	database
		.authenticate()
		.then(() => {
			logger.info("Connection has been established successfully.");

			database
				.sync({
					// alter: process.env.NODE_ENV === "production",
					// force: process.env.NODE_ENV !== "production",
					// logging: (data) => logger.debug(data),
					alter: true
				})
				.then(() => {
					logger.info("DB synced");
					// 	initTestData();
				});
		})
		.catch((err) => {
			logger.error("Unable to connect to the database");
			logger.error(err);
		});

	logger.info(`Server started on port ${PORT}`);
});
