// the receiving discord webhook for all server messages

"use strict";

const { WebhookClient } = require("discord.js");

// to be transferred into a database of users -> webhook urls in mysql,
// for now going to hard-code until Discord API is hooked up to the server
const urls = [
  "https://discord.com/api/webhooks/972880881335271465/FfDqG5_54FaFLfsJsre0czOnUaD_Y_4CsxmBXA9EUt-lMhTSpP86eIu3NAMtrMnqFd6D",
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
