import md5 from "md5";

const SK = process.env.SECRET_KEY ?? "S3cR3T";

export default function (password) {
	if (typeof password == "string") return md5(password + SK);
	else throw new Error("Invalid type");
}
