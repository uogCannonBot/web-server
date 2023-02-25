"use strict";

const { Router } = require("express");
const db = require("../models/dbConnect");
const sendWcMessage = require("../utils/sendWcMessage");
const { v4: uuidv4 } = require("uuid");
const res = require("express/lib/response");
const bodyIsValidListing = require("../utils/bodyIsValidListing");

const router = new Router();

router.post("/listings", async (request, response) => {
  // Check that the listing is in the body of the request
  if (!request.body.listing) {
    return response.json({
      success: false,
      message: "listing was not provided in the request body",
    });
  }

  // Get the listing from the request body
  const { listing } = request.body;

  // validate the input and listing converted
  const { validateSuccess, validateMessage } = bodyIsValidListing(listing);
  if (!validateSuccess) {
    return response.status(400).json({
      success: validateSuccess,
      message: validateMessage,
    });
  }

  let dbConnection = await db.get().getConnection(); // get the database connection
  if (!dbConnection) {
    return response.status(500).json({
      success: false,
      message: "Unable to connect to perform queries for some reason",
    });
  }

  // wrap queries into try-catches
  try {
    // Check if the listing exists in the database
    // we only want duplicates if the following changes
    // address, availability date, type of listing, price, distance, bedrooms
    const selectQuery =
      "SELECT * FROM houses WHERE (address = ? AND available = ? AND l_type = ? AND price = ? AND distance = ? AND rooms = ?)";
    const [rows, fields] = await dbConnection.query(selectQuery, [
      listing.address,
      `${listing.available.getUTCFullYear()}/${
        listing.available.getUTCMonth() + 1
      }/${listing.available.getUTCDate()}`, // YYYY:MM:DD
      listing.listingType,
      listing.price,
      listing.distance,
      listing.rooms,
    ]);

    // If listing DNE, Add the listing to the data
    if (!rows || rows.length === 0) {
      listing.id = uuidv4(); // add a unique id to the listing itself
      const insertQuery =
        "INSERT INTO houses (id, post_date, available, l_type, h_type, address, distance, sublet, rooms, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const [resHeader, colHeader] = await dbConnection.query(insertQuery, [
        listing.id,
        listing.postDate,
        listing.available,
        listing.listingType,
        listing.houseType,
        listing.address,
        listing.distance,
        listing.sublet,
        listing.rooms,
        listing.price,
      ]);

      // create a feature object to parse each listing feature for insertion into database
      let features = {
        petsAllowed: false,
        smoking: false,
        parkingInc: false,
        laundry: false,
        cooking: false,
      };
      listing.features.forEach((feature) => {
        switch (feature) {
          case "Pets OK":
            features.petsAllowed = true;
            break;
          case "Parking Included":
            features.parkingInc = true;
            break;
          case "No Smoking":
            features.smoking = true;
            break;
          case "Laundry Facilities":
            features.laundry = true;
            break;
          case "Cooking Facilities":
            features.cooking = true;
            break;
          default:
            break;
        }
      });

      // After the listing has been added to the `houses` table, add it's corresponding features to the `houseFeatures` table
      features.id = uuidv4();
      await dbConnection.query(
        "INSERT INTO houseFeatures (id, house_id, pets_allowed, smoking, parking_inc, laundry, cooking) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          features.id,
          listing.id,
          features.petsAllowed,
          features.smoking,
          features.parkingInc,
          features.laundry,
          features.cooking,
        ]
      );

      // Send a webhook message that a new listing is added to Discord
      try {
        // TODO: replace with separate task to filter all webhooks
        // and send messages to all webhooks (job queue)
        sendWcMessage(listing);
      } catch (err) {
        console.error(err);
        return response.status(500).json({
          success: false,
          error:
            "admin.js: An error occurred when trying to send a listing to the Discord WebHook",
        });
      }

      await response.status(201).json({
        success: true,
        message: "successfully added a new listing",
        listing,
      });
    } else {
      // return early if the listing exists already
      await response.status(200).json({
        success: true,
        message: "listing already exists",
      });
    }
  } catch (err) {
    console.error(err);
  } finally {
    dbConnection.release();
  }
});

module.exports = router;
