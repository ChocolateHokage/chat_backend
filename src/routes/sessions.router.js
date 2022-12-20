import { Router } from "express";
import { create, refresh, remove } from "../controllers/sessions.controller.js";
import { withAuth } from "../modules/index.js";
import { sessionsValidator } from "../validators/index.js";

const sessionsRouter = Router();

sessionsRouter
	.route("/")
	.post(sessionsValidator.login, create)
	.delete(withAuth, remove);

sessionsRouter.route("/refresh").get(refresh);

export default sessionsRouter;
