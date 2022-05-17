// the receiving discord webhook for all server messages

"use strict";

const { WebhookClient, MessageEmbed } = require("discord.js");
const urls = [
  "https://discord.com/api/webhooks/972880881335271465/FfDqG5_54FaFLfsJsre0czOnUaD_Y_4CsxmBXA9EUt-lMhTSpP86eIu3NAMtrMnqFd6D",
  "https://discord.com/api/webhooks/972882801043046400/wr0k4r-TbDA1rxrOj0bZJkAVYpLUgbx40RgX6t0Zsr4CihqLmsxdNoh-0Cr-7J6RxKsm",
];

const sendWcMessage = (listing) => {
  urls.forEach((url) => {
    const webhookClient = new WebhookClient({ url });

    // edit the appearance of the webhook
    webhookClient
      .edit({
        name: "TheCannon",
        avatar: "http://localhost:8080/cannon.png",
      })
      .catch(console.error);

    // Create an embed with all the information from the listing
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

    // send the message
    webhookClient.send({
      embeds: [embed],
      files: ["./public/house.png", "./public/cannon.png"],
    });
  });
};

module.exports = {
  sendWcMessage,
};
