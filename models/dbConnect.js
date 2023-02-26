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
        port: config.database.PORT,
        user: config.database.USER, // changes based on local-dev or production
        password: config.database.PASSWORD,
        database: "cannon",
      });

      // uncomment code below to debug database connections
      /*
      pool.on("acquire", function (connection) {
        console.log(`Connection ${connection.threadId} acquired`);
      });

      pool.on("release", function (connection) {
        console.log(`Connection ${connection.threadId} released`);
      });
      */

      console.log("dbConnect.js: Successfully connected to MySQL server");
    } catch (err) {
      console.log("dbConnect.js: Failed to connect to database");
    }
  },

  get: function () {
    return pool;
  },
};
