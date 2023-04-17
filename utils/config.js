require("dotenv").config();

const config = {
  app: {
    PORT: process.env.PORT,
    HASH: process.env.HASH,
    PASSWORD: process.env.PASSWORD,
    SECRET: process.env.SECRET,
    URL:
      process.env.NODE_ENV === "development"
        ? process.env.LOCAL_URL
        : process.env.PRODUCTION_URL,
  },
  database: {
    USER:
      process.env.NODE_ENV === "development"
        ? process.env.LOCAL_USER
        : process.env.PRODUCTION_USER,
    PASSWORD: process.env.DB_PASSWORD,
    PORT: process.env.DB_PORT,
  },
  connection: {
    BASE_URL: process.env.BASE_URL,
  },
  discord: {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
  },
  redis: {
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
  }
};

module.exports = config;
