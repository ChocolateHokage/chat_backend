import winston from "winston";

class Logger {
	static #dev() {
		const logDevFormat = winston.format.printf(
			({ level, message, timestamp, stack }) =>
				`[${new Date(timestamp).toLocaleTimeString()}] ${level}: ${
					stack ?? message
				}`,
		);

		return winston.createLogger({
			level: "debug",
			exitOnError: false,
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.errors({ stack: true }),
				logDevFormat,
			),
			transports: [new winston.transports.Console()],
		});
	}

	static #prod() {
		const logProdFormat = winston.format.printf(
			({ level, message, timestamp, stack }) =>
				`[${new Date(timestamp).toLocaleString()}] ${level}: ${
					stack ?? message
				}`,
		);

		return winston.createLogger({
			level: "info",
			exitOnError: false,
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.errors({ stack: true }),
				logProdFormat,
			),
			defaultMeta: { service: "user-service" },
			transports: [
				new winston.transports.File({
					filename: `logs/${Date.now()}.log`,
				}),
			],
		});
	}

	static logger() {
		if (process.env.NODE_ENV === "production") {
			return this.#prod();
		} else {
			return this.#dev();
		}
	}
}

export default Logger.logger();
