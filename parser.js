const axios = require("axios"); // send requests
const cheerio = require("cheerio"); // parse html on server
const { cannonPath } = require("./paths");

/**
 *
 * @param {response.data} page
 */
async function getListings(page) {
  // convert the page into parsed cheerio html
  const $ = cheerio.load(page);

  // create an array that holds all table listings
  let listings = [];

  if ($("#pagination") != null) {
    // get the number of pages to go through
    const pages = parseInt(
      $(
        $("#pagination").children()[$("#pagination").children().length - 2]
      ).text()
    );

    // get the href path to append (since thecannon uses separate paths)
    let pagePath = $($($("#pagination").children()[0]).children()[0]).attr(
      "href"
    );
    // console.log(pagePath.replace(/.$/, "2"));

    // iterate over each possible page
    console.log("pages = ", pages);
    for (let i = 0; i < pages; i++) {
      const res = await axios.get(
        cannonPath + pagePath.replace(/.$/, String(i + 1))
      );
      tableToJSON(res.data, listings);
    }
  } else {
    console.log("NULL");
    tableToJSON(page, listings);
  }
  return listings;
}

/**
 *
 * @param {response.data} page
 * @param {[]} listings
 */
function tableToJSON(page, listings) {
  // convert the page into parsed cheerio html
  const $ = cheerio.load(page);

  // get the number of listings in the table
  const tableRows = $("tbody").children("tr").length;

  // iterate over each row in the table listing
  for (let i = 0; i < tableRows; i++) {
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
    for (let j = 0; j < row.children.length; j++) {
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
    // console.log(rowInfo);
    listings.push(rowInfo);
  }
}

module.exports = {
  getListings,
};
