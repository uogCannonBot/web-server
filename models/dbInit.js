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
      'CREATE TABLE IF NOT EXISTS houses (id VARCHAR(255) NOT NULL PRIMARY KEY, post_date DATE NOT NULL, available DATE NOT NULL, l_type BOOLEAN NOT NULL, h_type ENUM ("House", "Shared House", "Apartment/Condo", "Shared Apartment/Condo", "Bachelor Apartment") NOT NULL, address VARCHAR(250) NOT NULL, distance VARCHAR(8) NOT NULL, sublet BOOLEAN NOT NULL, rooms INT NOT NULL, price VARCHAR(50) NOT NULL)'
    );
    await connection.execute(
      // house-features table
      "CREATE TABLE IF NOT EXISTS houseFeatures (id VARCHAR(255) NOT NULL PRIMARY KEY, house_id VARCHAR(255) NOT NULL, pets_allowed BOOLEAN NOT NULL, smoking BOOLEAN NOT NULL, parking_inc BOOLEAN NOT NULL, laundry BOOLEAN NOT NULL, cooking BOOLEAN NOT NULL, FOREIGN KEY (house_id) REFERENCES houses(id))"
    );
    await connection.execute(
      // user table
      "CREATE TABLE IF NOT EXISTS users (user_id BIGINT NOT NULL PRIMARY KEY, avatar_id VARCHAR(100) NOT NULL, email TINYTEXT NOT NULL)"
    );
    await connection.execute(
      // webhook table
      "CREATE TABLE IF NOT EXISTS webhooks (webhook_id VARCHAR(255) NOT NULL PRIMARY KEY, user_id BIGINT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, hook_url VARCHAR(255) NOT NULL, name TINYTEXT NOT NULL, FOREIGN KEY (user_id) REFERENCES users(user_id), UNIQUE(hook_url))"
    );
    await connection.execute(
      // webhook-options table
      'CREATE TABLE IF NOT EXISTS webhookOptions (user_id BIGINT NOT NULL, webhook_id VARCHAR(255) NOT NULL, house_type ENUM ("House", "Shared House", "Apartment/Condo", "Shared Apartment/Condo", "Bachelor Apartment"), listing_type INT, sublet INT, bedrooms INT, low_price_range INT, high_price_range INT, start_date DATE, end_date DATE, FOREIGN KEY (user_id) REFERENCES users(user_id), FOREIGN KEY (webhook_id) REFERENCES webhooks(webhook_id))'
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
