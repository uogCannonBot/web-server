require("dotenv").config();

const config = {
	app: {
	   PORT: process.env.PORT,
	   HASH: process.env.HASH,
	   PASSWORD: process.env.PASSWORD,
	},
	database: {
	   PASSWORD: process.env.DB_PASSWORD,
	},
	connection: {
	   BASE_URL: process.env.BASE_URL,
	},
};

module.exports = config;
