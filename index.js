/**
 * Author: Jason Kyle Tan
 * File: index.js
 * Description: The purpose of this script is to be run every 5 minutes
 *              on an external server and parse thecannon website for the listings being requested
 *              and then sending a request to the server-listener for updating the listings in the database
 */

"use strict";

require("dotenv").config();
const axios = require("axios"); // send requests
const parser = require("./scripts/parser");
const { housePath } = require("./scripts/paths");

/**
 * General Form of Listings
 */
/*
let params = {
  subType: null,
  h_lType: 1,
  h_sublet: "y",
  h_bedrooms: 4,
  h_price_range: null,
  c_search: null,
  pg: 4, // can be tracked from the first request
};
*/

/**
 * Type of Listings to Get (No sublets, only offering houses)
 */
let params = {
  subType: null, // type of house - integer
  h_lType: 1, // offering (1), wanted (2) - integer
  h_sublet: "n", // sublet ("y"), ("n") - string
  h_bedrooms: null, // number of bedrooms - integer
  h_price_range: null, // price range - integer
  c_search: null, // search keywords
};

(async () => {
  // get the first page on thecannon website
  let res = await axios.get(housePath, { params });

  // get the total number of listings on each loaded page from the first page
  const allListings = await parser.getListings(res.data, parser.tableToJSON);
  // console.dir(allListings, { maxArrayLength: null }); // logs out all listings

  // filter by todays listings
  const todaysListings = allListings.filter((listing) => {
    // get todays date but without any seconds passed
    const today = new Date(new Date().setHours(0, 0, 0, 0));

    // check if the listings date is the same as TODAY
    if (today.valueOf() == listing.postDate.valueOf()) {
      return true;
    }
    return false;
  });

  // log all listings from today
  console.log(todaysListings);

  // For each listing today, make a request with the password and the listing itself
  console.log("There are ", todaysListings.length, " listings today");

  todaysListings.forEach(async (listing) => {
    try {
      axios
        .post(
          "https://ac61-2607-fea8-8420-6900-9566-4247-2eda-8cd3.ngrok.io/admin/listings",
          {
            PASSWORD: process.env.PASSWORD,
            listing,
          }
        )
        .then((res) => {
          console.log(
            "Successfully added listing to database and sent to Discord"
          );
        });
    } catch (err) {
      console.error(err);
    }
  });
})();
