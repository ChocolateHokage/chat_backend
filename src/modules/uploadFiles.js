import multer from "multer";
import path from "path";

export default class UploadFiles {
	static uploadImage() {
		return multer({
			storage: multer.diskStorage({
				destination: (req, file, cb) => {
					cb(null, path.resolve("static", "uploads"));
				},
				filename: (req, file, cb) => {
					cb(null, file.fieldname + "-" + Date.now());
				},
			}),
			fileFilter: (req, file, cb) =>
				cb(null, file.mimetype.split("/")[0] === "image"),
		});
	}
}
