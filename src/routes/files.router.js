import { Router } from "express";
import { uploadFile } from "../controllers/files.controller.js";
import { withAuth } from "../modules/index.js";

const filesRouter = Router();

filesRouter.route("/").post(withAuth, uploadFile);

export default filesRouter;
