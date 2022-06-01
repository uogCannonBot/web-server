"use strict";

require("dotenv").config();

const mysql = require("mysql2/promise"); // get client

let pool;

module.exports = {
  connect: async function () {
    try {
      pool = await mysql.createPool({
        connectionLimit: 10,
        host: "localhost",
        user: "root",
        password: process.env.DB_PASSWORD,
        database: "cannon",
      });

      console.log("dbConnect.js: Successfully connected to MySQL server");
    } catch (err) {
      console.log("dbConnect.js: Failed to connect to database");
    }
  },

  get: function () {
    return pool;
  },
};
