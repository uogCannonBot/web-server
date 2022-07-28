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
    return false;
  }

  // check valid listing type (offering/wanted)
  if (
    options.listing_type !== null &&
    Number.isInteger(options.listing_type) &&
    !(options.listing_type === 1 || options.listing_type === 2)
  ) {
    return false;
  }

  // check valid sublet options (yes/no)
  if (
    options.sublet !== null &&
    Number.isInteger(options.sublet) &&
    !(options.sublet === 1 || options.sublet === 2)
  ) {
    return false;
  }
  // check valid bedrooms options (between options 1-5 if provided)
  if (
    options.bedroom !== null &&
    Number.isInteger(options.bedrooms) &&
    !(options.bedrooms >= 1 && options.bedrooms <= 5)
  ) {
    return false;
  }
  // check valid price range options (between options 1-6 if provided)
  if (
    options.price_range !== null &&
    Number.isInteger(options.price_range) &&
    !(options.price_range >= 1 && options.price_range <= 6)
  ) {
    return false;
  }

  return true;
};

module.exports = bodyIsValidWebhook;
