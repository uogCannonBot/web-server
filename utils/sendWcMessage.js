"use strict";

const wb = require("./webhook");
const { MessageEmbed } = require("discord.js");

module.exports = async function sendWcMessage(listing) {
  // get all related webhook clients
  const webhookClients = await wb.filterClients(listing);
  // console.log("webhookClients: ", webhookClients);

  // Create an embed with all the information from the listing
  let embed;
  try {
    embed = new MessageEmbed()
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
        { name: "🛌 Rooms", value: listing.rooms, inline: true },
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
  } catch (err) {
    throw err;
  }
  webhookClients.forEach(async (webhook) => {
    // send the message
    const { client } = webhook;
    return await client
      .send({
        embeds: [embed],
        files: ["./public/house.png", "./public/cannon.png"],
      })
      .then((res) => true)
      .catch((err) => {
        console.log(
          "An error occurred sending a Discord WebHook Message for the listing with address: ",
          listing.address
        );
        console.error(err);
        return false;
      });
  });
};
