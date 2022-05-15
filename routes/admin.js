"use strict";

const db = require("../models/dbConnect");
const { sendWcMessage } = require("../utils/webhook");

exports.load = async function (request, response) {
  // Check that the listing is in the body of the request
  if (!request.body.listing) {
    return response.json({
      success: false,
      message: "listing was not provided in the request body",
    });
  }

  // Get the listing from the request body
  const { listing } = request.body;
  listing.postDate = new Date(listing.postDate); // parse the date
  listing.available = new Date(listing.available); // parse the date
  const listingType = listing.listingType === "Offering" ? 0 : 1; // get the type of listing (Offering/Wanted)
  // console.log(listing);

  // Check if the listing exists in the database via postDate, available, listingType, address, price
  const dbConnection = db.get(); // get the database connection
  const selectQuery =
    "SELECT * FROM houses WHERE (post_date = ? AND address = ? AND available = ? AND l_type = ? AND price = ?)";
  const [rows, fields] = await dbConnection.query(selectQuery, [
    listing.postDate,
    listing.address,
    listing.available,
    listingType,
    listing.price,
  ]);
  // console.log("returned: ", rows);

  // If listing DNE, Add the listing to the data
  if (!rows || rows.length === 0) {
    const insertQuery =
      "INSERT INTO houses (post_date, available, l_type, h_type, address, distance, sublet, rooms, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const [resHeader, colHeader] = await dbConnection.query(insertQuery, [
      listing.postDate,
      listing.available,
      listingType,
      listing.houseType,
      listing.address,
      listing.distance,
      listing.sublet === "No" ? 0 : 1,
      parseInt(listing.rooms),
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
    await dbConnection.query(
      "INSERT INTO houseFeatures (house_id, pets_allowed, smoking, parking_inc, laundry, cooking) VALUES (?, ?, ?, ?, ?, ?)",
      [
        resHeader.insertId,
        features.petsAllowed,
        features.smoking,
        features.parkingInc,
        features.laundry,
        features.cooking,
      ]
    );

    // Send a webhook message that a new listing is added to Discord
    sendWcMessage(listing);

    return response.json({
      success: true,
      message:
        "successfully added a new listing with the id: " + resHeader.insertId,
      listing,
    });
  } else {
    // return early if the listing exists already
    return response.json({
      success: true,
      message: "listing already exists",
    });
  }
};
