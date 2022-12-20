import hashids from "hashids";

const hasher = new hashids("pa634cIGYH567hycr9w7", 9);

export default {
	encode: (data) => {
		return hasher.encode(data);
	},
	decode: (hash) => {
		return hasher.decode(hash);
	},
};
