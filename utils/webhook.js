// the receiving discord webhook for all server messages

"use strict";

const { WebhookClient, MessageEmbed} = require("discord.js");
const db = require("../models/dbConnect");
const {isHouseAndWebhookEqual} = require("./helpers");

const filterWebhooks = async (listing) => {
  // check empty listing
  if (!listing) {
    throw new Error(
        "webhook.js at filterClients: no listing was provided to filter through"
    );
  }

  // connect to database
  const dbConnection = await db.get().getConnection();
  if (!dbConnection) {
    throw new Error(
        "webhook.js at \n\tmodule.exports.filterClients: unable to connect to database for filtering"
    );
  }

  // store the filtered webhooks
  let filteredWebhooks = [];

  try {
    // first, get all of the webhooks and their options combined
    const [webhooks, fields] = await dbConnection.query(
        "SELECT * FROM webhooks INNER JOIN webhookOptions ON (webhooks.webhook_id=webhookOptions.webhook_id AND webhooks.user_id=webhookOptions.user_id)",
        []
    );

    // get the house listing from the database
    const [house, houseFields] = await dbConnection.query(
        "SELECT * FROM houses WHERE id = ?",
        [listing.id]
    );
    if (!house || house.length === 0) {
      throw new Error(
          `webhook.js: house with id ${listing.id} does not exist in the HOUSES database`
      );
    } else if (house.length > 1) {
      throw new Error(
          `webhook.js: house with id ${listing.id} has duplicates in HOUSES database`
      );
    }
    // compare each webhook to the house
    filteredWebhooks = webhooks.filter((webhook) => isHouseAndWebhookEqual(webhook, house[0]));

    // turn them all into clients
    filteredWebhooks = filteredWebhooks.map((webhook) => {
      webhook.client = new WebhookClient({ url: webhook.hook_url });
      return webhook;
    });
  } catch (err) {
    throw err;
  } finally {
    await dbConnection.release();
  }

  return filteredWebhooks;
}

const createListingEmbed = (listing) => {
  const embed = new MessageEmbed()
      .setColor("#a0410d")
      .setTitle("New " + listing.houseType + " Listing")
      .setURL(listing.url)
      .setAuthor({
        name: "TheCannon",
        iconURL: "attachment://cannon.png",
        url: "https://thecannon.ca/",
      })
      .setThumbnail("attachment://house.png")
      .addFields(
          {
            name: "✅ Available",
            value: listing.available.toDateString(),
          },
          {
            name: "📍 Address",
            value: `[${
                listing.address
            }](https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                listing.address
            )})`,
          },
          { name: "🚀 Distance", value: listing.distance },
          { name: "🛌 Rooms", value: listing.rooms.toString(), inline: true },
          { name: "💵 Price", value: listing.price, inline: true },
          {
            name: "Features",
            value:
                listing.features.length > 0
                    ? "> " +
                    listing.features.reduce(
                        (prevFeature, currFeature) =>
                            prevFeature + "\n> " + currFeature
                    )
                    : "> None To Display",
          }
      )
      .setTimestamp()
      .setFooter({
        text: "TheCannon",
        iconURL: "attachment://cannon.png",
      });
    return embed;
}

const sendMessageToWebhook = async (webhook) => {

}

const createAndEditWebhook = async (url) => {
  const client = new WebhookClient({ url });

  await client.edit({
    name: "TheCannon",
    avatar: "./public/cannon.png",
  });
  return client;
}

module.exports = {
  filterWebhooks,
  createAndEditWebhook,
};
