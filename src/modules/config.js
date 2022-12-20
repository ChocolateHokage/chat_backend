export default {
	version: "1",
	rateLimitOptions: {
		message: "Too many requests.",
		max: 500,
		windowMs: 1000 * 60 * 10,
		legacyHeaders: false,
	},
	corsConfig: {
		origin: (origin, cb) => {
			cb(null, true)
		},
		methods: ["OPTIONS", "GET", "POST", "PUT", "DELETE"],
		credentials: true,
	},
};
