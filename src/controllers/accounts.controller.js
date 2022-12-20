import { Op } from "sequelize";
import { accountModel, authenticationModel } from "../models/index.js";
import { ApiError, token, encryptor } from "../modules/index.js";

export async function getAllAccounts(req, res, next) {
	try {
		const { offset, limit } = req.query;

		const accounts = await accountModel.findAndCountAll({
			offset: Number(offset ?? 0),
			limit: Number(limit ?? 12),
			attributes: ["id", "username", "avatar_url"],
		});

		res.status(accounts.rows.length ? 200 : 204).json(accounts);
	} catch (error) {
		next(error);
	}
}

export async function getOneAccount(req, res, next) {
	try {
		const { id } = req.params;

		const account = await accountModel.findByPk(id, {
			attributes: ["id", "username", "avatar_url"],
		});

		res.status(account?.id ? 200 : 204).json(account);
	} catch (error) {
		next(error);
	}
}

export async function updateAccountInfo(req, res, next) {
	try {
		res.json("In development");
	} catch (error) {
		next(error);
	}
}

export async function createAccount(req, res, next) {
	try {
		const { email, username, password } = req.body;

		const [account, created] = await accountModel.findOrBuild({
			where: {
				[Op.or]: {
					email,
					username,
				},
			},
			defaults: {
				email,
				username,
			},
		});

		if (!created) {
			next(ApiError.BadRequest("Email or username already registred"));
			return;
		}

		await account.save();

		await authenticationModel.create({
			password,
			accountId: account.getDataValue("id"),
		});

		const session_tokens = token.generateTokens({
			id: encryptor.encode(account.getDataValue("id")),
			username: account.username,
			email: account.email,
			avatar_url: account?.avatar_url,
			createdAt: account.createdAt,
			updatedAt: account.updatedAt,
		});

		token.saveToken(account.getDataValue("id"), session_tokens.refreshToken);

		res.cookie("refresh_token", session_tokens.refreshToken, {
			maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
			httpOnly: true,
			sameSite: "lax",
		});

		res.status(201).json({
			account: {
				id: encryptor.encode(account.getDataValue("id")),
				username: account.username,
				email: account.email,
				avatar_url: account?.avatar_url,
				createdAt: account.createdAt,
				updatedAt: account.updatedAt,
			},
			...session_tokens,
		});
	} catch (error) {
		next(error);
	}
}
