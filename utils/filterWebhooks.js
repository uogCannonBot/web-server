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

  filteredWebhooks = webhooks.filter((webhook) => {
    const webhookStartDate = webhook.start_date == null ? null : new Date(webhook.start_date)
    const webhookEndDate = webhook.end_date == null ? null : new Date(webhook.end_date);
    const houseDate = new Date(house.available);

    // parse the price of the house
    house.price = unformat(house.price);

    // check if the webhook and house aren't the same
    if (!(webhook.sublet == null) && webhook.sublet !== house.sublet) {
      return false;
    }
    // check if the webhook and house don't have the same number of rooms
    if (!(webhook.bedrooms == null) && !(webhook.bedrooms === house.rooms)) {
      return false;
    }
    // check if the webhook and house don't have the desired price range
    if (!(webhook.low_price_range == null) && house.price < webhook.low_price_range) {
      return false;
    }
    if (!(webhook.high_price_range == null) && house.price > webhook.high_price_range) {
      return false;
    }
    // check if webhook dates and house dates are not within specified ranges
    if (!(webhook.start_date == null) && houseDate.getTime() < webhookStartDate.getTime()){
      return false;
    }
    if (!(webhook.end_date == null) && houseDate.getTime() > webhookEndDate.getTime()){
      return false;
    }
    return true;
  });

  return filteredWebhooks;
};

module.exports = filterWebhooks;
