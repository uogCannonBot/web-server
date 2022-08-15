const { unformat } = require("accounting-js");

const filterWebhooks = (webhooks, house) => {
  let filteredWebhooks = [];
  /**
   * The following will be compared
   * - housing type (not yet)
   * - sublet
   * - rooms
   * - price
   */
  console.log("house: ", house);
  filteredWebhooks = webhooks.filter((webhook) => {
    // parse the price of the house
    house.price = unformat(house.price);

    // check if the webhook and house aren't the same
    if (webhook.sublet && !house.sublet) {
      return false;
    }
    // check if the webhook and house don't have the same number of rooms
    if (webhook.bedrooms && !(webhook.bedrooms === house.rooms)) {
      return false;
    }
    // check if the webhook and house don't have the desired price range
    if (webhook.low_price_range && !(house.price >= webhook.low_price_range)) {
      return false;
    }
    if (
      webhook.high_price_range &&
      !(house.price <= webhook.high_price_range)
    ) {
      return false;
    }
    return true;
  });

  return filteredWebhooks;
};

module.exports = filterWebhooks;
