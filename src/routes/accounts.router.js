import { Router } from "express";
import {
	createAccount,
	getAllAccounts,
	getOneAccount,
} from "../controllers/accounts.controller.js";
import { withAuth } from "../modules/index.js";
import { accountsValidator } from "../validators/index.js";

const accountsRouter = Router();

accountsRouter
	.route("/")
	.get(accountsValidator.getAllAccounts, withAuth, getAllAccounts)
	.post(accountsValidator.createAccount, createAccount);

accountsRouter
	.route("/:id")
	.get(accountsValidator.getOneAccount, withAuth, getOneAccount)
	.put(withAuth)
	.delete(withAuth);

export default accountsRouter;
