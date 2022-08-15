const bodyIsValidWebhook = (body) => {
  // check valid name
  if (!body.name || body.name === "") {
    return false;
  }

  const { options } = body;

  // check valid house type (between options 1-5 if provided)
  if (
    options.house_type !== null &&
    Number.isInteger(options.house_type) &&
    !(options.house_type >= 1 && options.house_type <= 5)
  ) {
    console.log("bodyIsValidWebhook.js: failed house");
    return false;
  }

  // check valid listing type (offering/wanted)
  if (
    options.listing_type !== null &&
    Number.isInteger(options.listing_type) &&
    !(options.listing_type === 0 || options.listing_type === 1)
  ) {
    console.log("bodyIsValidWebhook.js: failed listing");
    return false;
  }

  // check valid sublet options (yes/no)
  if (
    options.sublet !== null &&
    Number.isInteger(options.sublet) &&
    !(options.sublet === 0 || options.sublet === 1)
  ) {
    console.log("bodyIsValidWebhook.js: failed on sublet");
    return false;
  }
  // check valid bedrooms options
  if (options.bedrooms !== null && !Number.isInteger(options.bedrooms)) {
    console.log("bodyIsValidWebhook.js: failed bedroom");
    return false;
  }
  // check price ranges
  if (
    options.low_price_range !== null &&
    !Number.isInteger(options.low_price_range)
  ) {
    console.log("bodyIsValidWebhook.js: low price failed");
    return false;
  }
  if (
    options.high_price_range !== null &&
    !Number.isInteger(options.high_price_range)
  ) {
    console.log("bodyIsValidWebhook.js: high price failed");
    return false;
  }

  return true;
};

module.exports = bodyIsValidWebhook;
