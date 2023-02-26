const {isValidDate, isValidHouseType} = require("./helpers");


const MAX_WEBHOOK_NAME_LENGTH = 84;
const bodyIsValidListing = (listing) => {
  const validation = {
    validateSuccess: true,
    validateMessage: "",
  };

  if (!listing) {
    validation.validateSuccess = false;
    validation.validateMessage = "no listing was provided";
    return validation;
  }
  listing.postDate = new Date(listing.postDate); // parse the date
  listing.available = new Date(listing.available); // parse the date
  listing.listingType =
      listing.listingType === "Offering"
          ? 0
          : listing.listingType === "Wanted"
              ? 1
              : undefined; // get the type of listing (Offering/Wanted)
  listing.sublet =
      listing.sublet === "No" ? 0 : listing.sublet === "Yes" ? 1 : undefined;
  listing.rooms = parseInt(listing.rooms);

  // check that postDate and availableDate are provided and are date objects
  if (!isValidDate(listing.postDate)) {
    validation.validateSuccess = false;
    validation.validateMessage =
        "post date is an invalid date and cannot be parsed";
    return validation;
  }

  if (!isValidDate(listing.available)) {
    validation.validateSuccess = false;
    validation.validateMessage =
        "available date is an invalid date and cannot be parsed";
    return validation;
  }

  // check that listing type is provided and either of "Offering" or "Wanted"
  if (
      listing.listingType == null ||
      !(listing.listingType === 0 || listing.listingType === 1)
  ) {
    validation.validateSuccess = false;
    validation.validateMessage =
        'listing type is not either of "Offering" or "Wanted"';
    return validation;
  }
  // check that house type is any of the houseType enums
  if (!isValidHouseType(listing.houseType)) {
    validation.validateSuccess = false;
    validation.validateMessage =
        'housing type is not one of: ("House", "Shared House", "Apartment/Condo", "Shared Apartment/Condo", "Bachelor Apartment")';
    return validation;
  }

  // check that the house has an address
  if (listing.address == null) {
    validation.validateSuccess = false;
    validation.validateMessage = "no address was provided in the listing";
    return validation;
  }

  // check that sublet is either "No" or "Yes"
  if (
      listing.sublet == null ||
      !(listing.sublet === 0 || listing.sublet === 1)
  ) {
    validation.validateSuccess = false;
    validation.validateMessage =
        'listing sublet is not either of "Yes" or "No"';
    return validation;
  }
  // check that the number of rooms is a number and provided
  if (listing.rooms == null || isNaN(listing.rooms)) {
    validation.validateSuccess = false;
    validation.validateMessage = "listing rooms is not a number";
    return validation;
  }

  // check that price is provided
  if (listing.price == null) {
    validation.validateSuccess = false;
    validation.validateMessage = "listing price is not provided";
    return validation;
  }
  return validation;
};
const bodyIsValidWebhook = (body) => {
  const validation = {
    validateSuccess: true,
    validateMessage: "",
  }

  // check valid name
  if (!body.name || body.name === "") {
    validation.validateSuccess = false;
    validation.validateMessage = "name was not provided for webhook"
    return validation
  }

  // check name does not exceed certain length
  if (body.name.length > MAX_WEBHOOK_NAME_LENGTH){
    validation.validateSuccess = false;
    validation.validateMessage = `name is too long (max is ${MAX_WEBHOOK_NAME_LENGTH} characters)`
    return validation
  }

  const { options } = body;

  // check valid house type (between options 1-5 if provided)
  if (
      options.house_type !== null &&
      Number.isInteger(options.house_type) &&
      !(options.house_type >= 1 && options.house_type <= 5)
  ) {
    validation.validateSuccess = false;
    validation.validateMessage = `housing type must be an integer between 1 and 5 [house, s(house), (apt/cnd), s(apt/cnd), b(apt)] if provided`
    return validation
  }

  // check valid listing type (offering/wanted)
  if (
      options.listing_type !== null &&
      Number.isInteger(options.listing_type) &&
      !(options.listing_type === 0 || options.listing_type === 1)
  ) {
    validation.validateSuccess = false;
    validation.validateMessage = `listing type must either be Offering (0) or Wanted (1) if provided`
    return validation
  }

  // check valid sublet options (yes/no)
  if (
      options.sublet !== null &&
      Number.isInteger(options.sublet) &&
      !(options.sublet === 0 || options.sublet === 1)
  ) {
    validation.validateSuccess = false;
    validation.validateMessage = `sublet must either be Yes (1) or No (0) if provided`
    return validation
  }
  // check valid bedrooms options
  if (options.bedrooms !== null && !Number.isInteger(options.bedrooms)) {
    validation.validateSuccess = false;
    validation.validateMessage = `bedrooms must be an integer value if provided`
    return validation
  }
  // check price ranges
  if (
      options.low_price_range !== null &&
      !Number.isInteger(options.low_price_range)
  ) {
    validation.validateSuccess = false;
    validation.validateMessage = `low price range must be an integer value if provided`
    return validation
  }
  if (
      options.high_price_range !== null &&
      !Number.isInteger(options.high_price_range)
  ) {
    validation.validateSuccess = false;
    validation.validateMessage = `high price range must be an integer value if provided`
    return validation
  }

  if (options.start_date == null && !isValidDate(new Date(options.start_date))){
    validation.validateSuccess = false;
    validation.validateMessage = `start date must be the format of YYYY:MM:DD if provided`
    return validation
  }

  if (options.end_date == null && !isValidDate(new Date(options.end_date))){
    validation.validateSuccess = false;
    validation.validateMessage = `end date must be the format of YYYY:MM:DD if provided`
    return validation
  }

  return validation;
};

module.exports = {
  bodyIsValidWebhook,
  bodyIsValidListing
}