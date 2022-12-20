import { ApiError } from "../modules/index.js";

export const uploadFile = async (req, res, next) => {
	try {
		const { file } = req.files;

		res.send("In development");
	} catch (error) {
		next(error);
	}
};
