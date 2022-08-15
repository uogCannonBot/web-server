// the receiving discord webhook for all server messages

"use strict";

const { WebhookClient } = require("discord.js");
const filterWebhooks = require("./filterWebhooks");
const db = require("../models/dbConnect");

module.exports = {
  connect: async function () {
    const dbConnection = await db.get().getConnection();
    if (!dbConnection) {
      throw new Error(
        "webhook.js: unable to connect to database for webhook retrieval"
      );
    }

    // get all the urls
    try {
      const [webhooks, fields] = await dbConnection.query(
        "SELECT * FROM webhooks"
      );
      webhooks.forEach(async (webhook) => {
        try {
          const url = webhook.hook_url;
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
        } catch (err) {
          throw err;
        }
      });
    } catch (err) {
      throw err;
    } finally {
      dbConnection.release();
    }
    // upon success, nothing will log
  },
  get: async function () {
    let clients = [];
    const dbConnection = await db.get().getConnection();
    if (!dbConnection) {
      throw new Error(
        "webhook.js at get(): unable to acquire database connection for get"
      );
    }
    try {
      const [webhooks, fields] = await dbConnection.query(
        "SELECT * FROM webhooks",
        []
      );
      clients = JSON.parse(JSON.stringify(webhooks));
    } catch (err) {
      throw err;
    } finally {
      await dbConnection.release();
    }
    return clients;
  },
  filterClients: async function (listing) {
    // check empty listing
    if (!listing) {
      throw new Error(
        "webhook.js at filterClients: no listing was provided to filter through"
      );
    }

    // TODO: check valid listing (follows the structure)

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
      filteredWebhooks = filterWebhooks(webhooks, house[0]);

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
  },
};
