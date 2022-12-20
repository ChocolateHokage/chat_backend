import { Router } from "express";
import accountsRouter from "./accounts.router.js";
import chatsRouter from "./chats.router.js";
import filesRouter from "./files.router.js";
import sessionsRouter from "./sessions.router.js";

const router = Router();

router.use("/accounts", accountsRouter);
router.use("/sessions", sessionsRouter);
router.use("/chats", chatsRouter);
router.use("/files", filesRouter);

export default router;
