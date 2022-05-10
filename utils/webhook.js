const { WebhookClient, MessageEmbed, Webhook } = require("discord.js");
const urls = [
  "https://discord.com/api/webhooks/972880881335271465/FfDqG5_54FaFLfsJsre0czOnUaD_Y_4CsxmBXA9EUt-lMhTSpP86eIu3NAMtrMnqFd6D",
  "https://discord.com/api/webhooks/972882801043046400/wr0k4r-TbDA1rxrOj0bZJkAVYpLUgbx40RgX6t0Zsr4CihqLmsxdNoh-0Cr-7J6RxKsm",
];

const sendWcMessage = (message) => {
  urls.forEach((url) => {
    const webhookClient = new WebhookClient({ url });
    webhookClient.send({
      content: message,
    });
  });
};

module.exports = {
  sendWcMessage,
};
