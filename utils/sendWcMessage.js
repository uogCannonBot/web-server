"use strict";

const { filterWebhooks} = require("./webhook");
const { MessageEmbed } = require("discord.js");

module.exports = async function sendWcMessage(listing) {
  // get all related webhook clients
  const webhookClients = await filterWebhooks(listing);


  // TODO: replace with queuing system
  webhookClients.forEach(async (webhook) => {
    // send the message
    const { client } = webhook;
    try {

      const result = await client
          .send({
            embeds: [embed],
            files: ["./public/house.png", "./public/cannon.png"],
          });
    } catch (err){
      //
      // TODO: implement re-queuing and deletion of old webhooks (err.status === 404)
      //
      console.error(err);
    }
  });
};
