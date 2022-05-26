"use strict";

require("dotenv").config();

const mysql = require("mysql2/promise"); // get client

let connection;

module.exports = {
  connect: async function () {
    try {
      connection = await mysql.createConnection({
        host: "localhost",
        user: "jason",
        password: process.env.DB_PASSWORD,
        database: "cannon",
      });
      console.log("dbConnect.js: Successfully connected to MySQL server");
    } catch (err) {
      console.log("dbConnect.js: Failed to connect to database");
    }
  },

  get: function () {
    return connection;
  },
};
