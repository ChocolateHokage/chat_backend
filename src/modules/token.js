import jwt from "jsonwebtoken";
import { sessionModel } from "../models/index.js";

class Token {
	generateTokens(payload) {
		const accessToken = jwt.sign(
			payload,
			process.env.JWT_ACCESS_TOKEN ?? "s3cr3t",
			{
				expiresIn: "30m",
			},
		);
		const refreshToken = jwt.sign(
			payload,
			process.env.JWT_REFRESH_TOKEN ?? "s3cr3t_rfsh",
			{
				expiresIn: "30d",
			},
		);
		return { accessToken, refreshToken };
	}

	async saveToken(accountId, refreshToken) {
		const tokenData = await sessionModel.findOne({
			where: { accountId },
		});

		if (tokenData) {
			tokenData.hash = refreshToken;
			return tokenData.save();
		}

		const token = await sessionModel.create({
			accountId,
			hash: refreshToken,
		});

		return token;
	}

	async removeToken(hash) {
		const token_data = await sessionModel.destroy({
			where: {
				hash,
			},
		});
		return token_data;
	}

	async findToken(hash) {
		const token_data = await sessionModel.findOne({
			where: {
				hash,
			},
		});
		return token_data;
	}

	validateAccessToken(token) {
		try {
			const accountData = jwt.verify(
				token,
				process.env.JWT_ACCESS_TOKEN ?? "s3cr3t",
			);
			return accountData;
		} catch (error) {
			return null;
		}
	}

	validateRefreshToken(token) {
		try {
			const accountData = jwt.verify(
				token,
				process.env.JWT_REFRESH_TOKEN ?? "s3cr3t",
			);
			return accountData;
		} catch (error) {
			return null;
		}
	}
}

export default new Token();
