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

module.exports = {
  isValidDate,
  isValidHouseType
}