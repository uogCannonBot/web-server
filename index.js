const axios = require("axios"); // send requests
const cheerio = require("cheerio"); // parse html on server
const puppeteer = require("puppeteer"); // used for testing
const parser = require("./parser");
const { housePath } = require("./paths");

/*
// get the rest from the front-end (not the page!)
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
 * Form data JSON - Received from front end
 */
let params = {
  subType: null, // type of house - integer
  h_lType: 1, // offering (1), wanted (2) - integer
  h_sublet: null, // sublet ("y"), ("n") - string
  h_bedrooms: null, // number of bedrooms - integer
  h_price_range: null, // price range - integer
  c_search: null, // search keywords
  // pg: 1, // can be tracked from the first request (if over limit, then goes back to 1)
};

(async () => {
  /*
  axios.interceptors.request.use(
    function (config) {
      console.log(config.url);
      return config;
    },
    function (err) {
      return Promise.reject(err);
    }
  );
  */

  const res = await axios.get(housePath, { params });

  // get the total number of listings on each loaded page
  const allListings = await parser.getListings(res.data);
  console.dir(allListings, { maxArrayLength: null });
})();
