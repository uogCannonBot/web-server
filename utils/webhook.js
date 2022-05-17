// the receiving discord webhook for all server messages

"use strict";

const { WebhookClient } = require("discord.js");

const urls = [
  "https://discord.com/api/webhooks/972880881335271465/FfDqG5_54FaFLfsJsre0czOnUaD_Y_4CsxmBXA9EUt-lMhTSpP86eIu3NAMtrMnqFd6D",
  "https://discord.com/api/webhooks/972882801043046400/wr0k4r-TbDA1rxrOj0bZJkAVYpLUgbx40RgX6t0Zsr4CihqLmsxdNoh-0Cr-7J6RxKsm",
];

let clients = [];

module.exports = {
  connect: async function () {
    urls.forEach(async (url) => {
      try {
        const webhookClient = new WebhookClient(
          { url },
          { restRequestTimeout: 30000 }
        );
        webhookClient
          .edit({
            name: "TheCannon",
            avatar: "./public/cannon.png",
          })
          .catch(console.error);
        clients.push(webhookClient);
      } catch (err) {
        console.log(`Failed to connect to Webhook with url: ${url}`);
      }
    });
    if (clients.length > 0) {
      console.log("Successfully connected to at least ONE webhook");
    } else {
      console.log("Failed to connect to ANY webhook");
    }
  },
  get: function () {
    return clients;
  },
};
