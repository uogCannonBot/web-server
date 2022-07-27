"use strict";

/* make sure that the database 'cannon' exists */
const db = require("./dbConnect");

async function main() {
  await db.connect(); // first create a pool
  let connection;
  try {
    // get said pool
    connection = db.get();

    // initialize all related tables
    await connection.execute(
      // listings table
      "CREATE TABLE IF NOT EXISTS listings (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, type VARCHAR(50) NOT NULL)"
    );
    await connection.execute(
      // house-listings table
      "CREATE TABLE IF NOT EXISTS houses (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, post_date DATETIME NOT NULL, available DATETIME NOT NULL, l_type BOOLEAN NOT NULL, h_type VARCHAR(50) NOT NULL, address VARCHAR(250) NOT NULL, distance VARCHAR(8) NOT NULL, sublet BOOLEAN NOT NULL, rooms INT NOT NULL, price VARCHAR(50) NOT NULL)"
    );
    await connection.execute(
      // house-features table
      "CREATE TABLE IF NOT EXISTS houseFeatures (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, house_id INT NOT NULL, pets_allowed BOOLEAN NOT NULL, smoking BOOLEAN NOT NULL, parking_inc BOOLEAN NOT NULL, laundry BOOLEAN NOT NULL, cooking BOOLEAN NOT NULL, FOREIGN KEY (house_id) REFERENCES houses(id))"
    );
    await connection.execute(
      // user table
      "CREATE TABLE IF NOT EXISTS users (user_id BIGINT NOT NULL PRIMARY KEY, avatar_id VARCHAR(100) NOT NULL, email TINYTEXT NOT NULL)"
    );
    await connection.execute(
      // webhook table
      "CREATE TABLE IF NOT EXISTS webhooks (webhook_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, user_id BIGINT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, hook_url TINYTEXT NOT NULL, FOREIGN KEY (user_id) REFERENCES users(user_id))"
    );
    await connection.execute(
      // webhook-options table
      "CREATE TABLE IF NOT EXISTS webhookOptions (user_id BIGINT NOT NULL, webhook_id INT NOT NULL, house_type INT NOT NULL, listing_type INT NOT NULL, sublet INT NOT NULL, bedrooms INT NOT NULL, price_range INT NOT NULL, FOREIGN KEY (user_id) REFERENCES users(user_id), FOREIGN KEY (webhook_id) REFERENCES webhooks(webhook_id))"
    );

    console.log("dbInit.js: Successfully initialized all tables");
  } catch (err) {
    console.log("dbInit.js: error: " + err);
  } finally {
    if (connection && connection.end) connection.end();
    console.log("dbInit.js: Closed MySQL connection");
  }
}

main();
