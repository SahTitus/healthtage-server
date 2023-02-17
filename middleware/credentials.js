import allowedOrigins  from "../config/allowedOrigins.js";

const credentials = (req, res, next) => {
	const origin = req.headers.origin;
	if (allowedOrigins.includes(origin)) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE, OPTIONS,");
		res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));
		res.setHeader('Access-Control-Allow-Origin',"*");
		res.setHeader('Access-Control-Allow-Headers',"*");
		res.header('Access-Control-Allow-Credentials', true);
	}
	next();
};

export default credentials;