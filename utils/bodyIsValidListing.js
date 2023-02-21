const houseTypes = [
  "House",
  "Shared House",
  "Apartment/Condo",
  "Shared Apartment/Condo",
  "Bachelor Apartment",
];

const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date);
};

const isValidHouseType = (house) => {
  const type = houseTypes.filter((houseType) => house === houseType);
  return type.length === 1 ? true : false;
};

const bodyIsValidlisting = (listing) => {
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
  console.log("success reached");
  return validation;
};

module.exports = bodyIsValidlisting;
