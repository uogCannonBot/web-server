"use strict";

const config = require("../utils/config");

const mysql = require("mysql2/promise"); // get client

let pool;

module.exports = {
  connect: async function () {
    try {
      pool = await mysql.createPool({
        connectionLimit: 10,
        host: "localhost", // since they're hosted on the same system
        user: config.database.USER, // changes based on local-dev or production
        password: config.database.PASSWORD,
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
