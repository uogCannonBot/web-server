const axios = require("axios"); // send requests
const cheerio = require("cheerio"); // parse html on server
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

let params = {
  subType: null,
  h_lType: 1,
  h_sublet: null,
  h_bedrooms: null,
  h_price_range: null,
  c_search: null,
  pg: 1, // can be tracked from the first request
};

(async () => {
  // make the initial request
  const res = await axios.get(housePath, { params });

  // convert the page into parsed cheerio html
  const $ = cheerio.load(res.data);

  // get all the listings on the current page

  // console.log($("tbody").html());
  // console.log($("tbody").children());

  //
  const tableRows = $("tbody").children("tr").length;
  for (i = 0; i < tableRows; i++) {
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
      features: "", // 8
      price: "", // 9
    };
    let rowIndex = 0;

    for (j = 0; j < row.children.length; j++) {
      const child = row.children[j];
      if (child != null && $(child).html() != null) {
        let prop = $(child).html();
        switch (rowIndex) {
          case 0:
            rowInfo["postDate"] = prop;
            break;
          case 1:
            rowInfo["available"] = prop;
            break;
          case 2:
            rowInfo["listingType"] = prop;
            break;
          case 3:
            rowInfo["houseType"] = prop;
            break;
          case 4:
            rowInfo["address"] = prop;
            break;
          case 5:
            rowInfo["distance"] = prop;
            break;
          case 6:
            rowInfo["sublet"] = prop;
            break;
          case 7:
            rowInfo["rooms"] = prop;
            break;
          case 8:
            rowInfo["features"] = prop;
            break;
          case 9:
            rowInfo["price"] = prop;
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
