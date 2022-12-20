import {
	accountModel,
	authenticationModel,
	sessionModel,
} from "../models/index.js";
import { ApiError, token, hasher, encryptor } from "../modules/index.js";

export async function create(req, res, next) {
	try {
		const { email, password } = req.body;

		const target = await accountModel.findOne({
			where: { email },
			include: [{ model: authenticationModel, as: "authentication" }],
		});

		if (
			!target?.authentication ||
			target.authentication.password !== hasher(password)
		) {
			throw ApiError.BadRequest("Invalid email or password");
		}

		const session_tokens = token.generateTokens({
			id: encryptor.encode(target.getDataValue("id")),
			username: target.username,
			email: target.email,
			avatar_url: target.avatar_url,
			createdAt: target.createdAt,
			updatedAt: target.updatedAt,
		});

		token.saveToken(target.getDataValue("id"), session_tokens.refreshToken);

		res.cookie("refresh_token", session_tokens.refreshToken, {
			maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
			httpOnly: true,
			sameSite: "lax",
		});

		res.status(201).json({
			account: {
				id: encryptor.encode(target.getDataValue("id")),
				username: target.username,
				email: target.email,
				avatar_url: target.avatar_url,
				createdAt: target.createdAt,
				updatedAt: target.updatedAt,
			},
			...session_tokens,
		});
	} catch (error) {
		next(error);
	}
}

export async function remove(req, res, next) {
	try {
		const { refresh_token } = req.cookies;

		await token.removeToken(refresh_token);

		res.clearCookie("refresh_token");

		res.sendStatus(200);
	} catch (error) {
		next(error);
	}
}

export async function refresh(req, res, next) {
	try {
		const { refresh_token } = req.cookies;

		if (!refresh_token) {
			throw ApiError.UnauthorizedError();
		}

		const sessionData = await sessionModel.findOne({
			where: { hash: refresh_token },
		});

		const accountData = token.validateRefreshToken(refresh_token);
		const checkToken = await token.findToken(refresh_token);

		if (!sessionData || !(accountData && checkToken)) {
			throw ApiError.UnauthorizedError();
		}

		const account = await accountModel.findOne({
			where: { id: sessionData.accountId },
		});

		const session_tokens = token.generateTokens({
			id: encryptor.encode(account?.getDataValue("id")),
			username: account?.username,
			email: account?.email,
			avatar_url: account?.avatar_url,
			createdAt: account?.createdAt,
			updatedAt: account?.updatedAt,
		});

		token.saveToken(account?.getDataValue("id"), session_tokens.refreshToken);

		res.cookie("refresh_token", session_tokens.refreshToken, {
			maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
			httpOnly: true,
			sameSite: "lax",
		});

		res.status(201).json({
			account: {
				id: encryptor.encode(account?.getDataValue("id")),
				username: account?.username,
				email: account?.email,
				avatar_url: account?.avatar_url,
				createdAt: account?.createdAt,
				updatedAt: account?.updatedAt,
			},
			...session_tokens,
		});
	} catch (error) {
		next(error);
	}
}
