/* make sure that the database 'cannon' exists */

const mysql = require("mysql2/promise"); // get client
const parser = require("./parser/parser"); // listings parser and getter
const { housePath } = require("./parser/paths");
const axios = require("axios");

async function main() {
  let connection;
  try {
    // connect to the database
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "megaman10",
      database: "cannon",
    });
    console.log("Connected to MySQL server");

    // initialize all related tables
    await connection.execute(
      // listings table
      "CREATE TABLE IF NOT EXISTS listings (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, type VARCHAR(50) NOT NULL)"
    );
    await connection.execute(
      // house-listings table
      "CREATE TABLE IF NOT EXISTS houses (id INT NOT NULL PRIMARY KEY, post_date DATETIME NOT NULL, available DATETIME NOT NULL, l_type BOOLEAN NOT NULL, h_type VARCHAR(50) NOT NULL, address VARCHAR(250) NOT NULL, distance FLOAT(8) NOT NULL, sublet BOOLEAN NOT NULL, rooms INT NOT NULL, price FLOAT(8) NOT NULL, features_id INT NOT NULL UNIQUE)"
    );
    await connection.execute(
      // house-features table
      "CREATE TABLE IF NOT EXISTS houseFeatures (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, pets_allowed BOOLEAN NOT NULL, smoking BOOLEAN NOT NULL, parking_inc BOOLEAN NOT NULL, laundry BOOLEAN NOT NULL, cooking BOOLEAN NOT NULL)"
    );

    // get all house listings on thecannon website
    const page = await axios.get(housePath);
    const houseListings = await parser.getListings(
      page.data,
      parser.tableToJSON
    );
    // console.dir(houseListings);

    console.log("dbInit.js: Successfully initialized all tables");
  } catch (err) {
    console.log("dbInit.js: error: " + err);
  } finally {
    if (connection && connection.end) connection.end();
    console.log("dbInit.js: Closed MySQL connection");
  }
}

main();
