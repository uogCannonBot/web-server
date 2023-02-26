const {sendMessageToWebhook} = require("../webhook");
const hookMessageProcess = async (job) => {
  const { data } = job; // { webhook, listingToFormat }

  // since jobs are read from redis
  // the data is stored in json and does not
  // contain the consistent data typing
  // thus we have to change it manually
  data.listingToFormat.available = new Date(data.listingToFormat.available);
  data.listingToFormat.postDate = new Date(data.listingToFormat.postDate);

  let response;
  try {
    response = await sendMessageToWebhook(data.webhook, data.listingToFormat);
  } catch (err) {
    throw err;
  }
  return response;
}

module.exports = { hookMessageProcess }