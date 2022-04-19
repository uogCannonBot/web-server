const axios = require("axios"); // send requests
const cheerio = require("cheerio"); // parse html on server
const { existsOne } = require("domutils");
const puppeteer = require("puppeteer"); // used for testing

// path for thecannon and house listings
const cannonPath = "https://www.thecannon.ca";
const housePath = cannonPath + "/classifieds/housing";

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
  pg: 2, // can be tracked from the first request (if over limit, then goes back to 1)
};

(async () => {
  // make the initial request
  const res = await axios.get(housePath, { params });

  // convert the page into parsed cheerio html
  const $ = cheerio.load(res.data);

  // get the number of listings in the table
  const tableRows = $("tbody").children("tr").length;

  // iterate over each row in the table listing
  for (i = 0; i < tableRows; i++) {
    // create an object to hold all row information to be parsed
    const row = $("tbody").children("tr")[i];
    let rowInfo = {
      postDate: "", // 0
      available: "", // 1
      listingType: "", // 2
      houseType: "", // 3
      address: "", // 4
      distance: "", // 5
      sublet: "", // 6
      rooms: "", // 7
      features: [], // 8
      price: "", // 9
    };

    let rowIndex = 0; // keep track of which information is being parsed

    // iterate over each cell in the row (post date, availability, house type, etc...)
    for (j = 0; j < row.children.length; j++) {
      const child = row.children[j]; // the current table cell (column)
      if (child != null && $(child).html() != null) {
        let prop = $(child).html();
        switch (rowIndex) {
          case 0:
            rowInfo["postDate"] = prop != (undefined || null) ? prop : "N/A";
            break;
          case 1:
            rowInfo["available"] = prop != (undefined || null) ? prop : "N/A";
            break;
          case 2:
            rowInfo["listingType"] = prop != (undefined || null) ? prop : "N/A";
            break;
          case 3:
            rowInfo["houseType"] = prop != (undefined || null) ? prop : "N/A";
            break;
          case 4:
            // contains <a> tag inside the table cell
            const address = $(child).children().html();
            rowInfo["address"] =
              address != (undefined || null) ? address : "N/A";
            break;
          case 5:
            rowInfo["distance"] = prop != (undefined || null) ? prop : "N/A";
            break;
          case 6:
            rowInfo["sublet"] = prop != (undefined || null) ? prop : "N/A";
            break;
          case 7:
            rowInfo["rooms"] = prop != (undefined || null) ? prop : "N/A";
            break;
          case 8:
            // get the <li> elements inside the <ul> of features
            const features = $(child).children(".features").children();
            $(features).each(function () {
              // get the <img> element in the <li> to get the feature
              const feature = $(this).children().prop("alt");
              rowInfo["features"].push(feature);
            });
            break;
          case 9:
            rowInfo["price"] = prop != (undefined || null) ? prop : "N/A";
            break;
        }
        rowIndex++;
      }
    }
    console.log(rowInfo);
  }

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setContent(res.data);
  // await page.goto(__dirname + "/index.html");
})();
