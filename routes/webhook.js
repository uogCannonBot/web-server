const { Router } = require("express");
const checkAuthenticated = require("../middleware/checkAuthenticated");
const db = require("../models/dbConnect");
const bodyIsValidWebhook = require("../utils/bodyIsValidWebhook");
const { WebhookClient } = require("discord.js");

const router = new Router();

// add checkAuthenticated to all routes once done developing
// remove later
const USER_ID = BigInt("1005131091646087311")

/**
 * Request Type - GET
 * Purpose - Fetch all the users webhooks and return them as an array
 */
router.get("/", async (req, res) => {
  // Get the current users id
  // const { id } = req.session.passport.user;
  const id = USER_ID;
  if (!id) {
    return res
      .status(400)
      .json({ error: "an invalid id was provided as a user" });
  }

  // Get the database connection
  const dbConnection = await db.get().getConnection();
  if (!dbConnection) {
    return res.status(500).json({ error: "failed to connect to database" });
  }

  // Get all webhooks with the current user id
  try {
    console.log(id)
    const [webhooks, fields] = await dbConnection.query(
      "SELECT * FROM webhooks WHERE user_id = ?",
      [id]
    );
    res.json({
      webhooks,
    });
  } catch (err) {
    res
      .status(400)
      .json({ error: `failed to get webhooks with user id: ${id}` });
    throw err;
  } finally {
    await dbConnection.release();
  }
});

/**
 * Request Type - GET
 * Purpose - Fetch specific webhook
 */
router.get("/:webhookId", async (req, res) => {
  // Get the current users id
  // const { id } = req.session.passport.user;
  const id = USER_ID;
  if (!id) {
    return res
        .status(400)
        .json({ error: "an invalid id was provided as a user" });
  }

  // Get the webhook id from url
  const { webhookId } = req.params;
  if (!webhookId) {
    return res
        .status(404)
        .json({ error: "no webhook id was provided to get" });
  }

  // Get the database connection
  const dbConnection = await db.get().getConnection();
  if (!dbConnection) {
    return res.status(500).json({ error: "failed to connect to database" });
  }

  // Get one webhook with the current user id and webhook id
  try {
    const [webhook, fields] = await dbConnection.query(
        "SELECT * FROM webhooks INNER JOIN webhookOptions ON (webhooks.webhook_id=webhookOptions.webhook_id AND webhooks.user_id=webhookOptions.user_id);",
        [id, webhookId]
    );
    res.json({
      webhook,
    });
  } catch (err) {
    res
        .status(400)
        .json({ error: `failed to get webhooks with user id: ${id}` });
    throw err;
  } finally {
    await dbConnection.release();
  }
});

/**
 * Request Type - POST
 * Purpose - Create a new webhook of a user
 */
router.post("/", async (req, res) => {
  // // Get the current users id
  // const id = BigInt(req.session.passport.user.id); // change later to CONST
  // if (!id) {
  //   return res.status(400).end();
  // }
  const id = USER_ID; // delete later

  // Get the request body
  const { body } = req;

  /**
   * Expected body format: ONE OF EACH
   *
   * {
   *    url: text
   *    name: text
   *    options: {
   *       house_type:
   *          1 - house
   *          2 - shared house
   *          3 - apartment/condo
   *          4 - shared a/c
   *          5 - bachelor apt
   *       listing_type:
   *          0 - offering
   *          1 - wanted
   *       sublet:
   *          1 - yes
   *          0 - no
   *       bedrooms:
   *          null - all bedrooms
   *          1 - 1
   *          2 - 2
   *          3 - 3
   *          4 - 4
   *          5 - 5+
   *       low_price_range:
   *          null - from zero
   *          number - from number
   *       high_price_range:
   *          null - to greater than zero (or if low is set, then it's greater than low)
   *          number - to number
   *       start_date:
   *          null - all listings before end_date
   *          date - start date
   *       end_date:
   *          null - all listings beyond start_date
   *          date - end date
   *    }
   * }
   */
  // check that the body provided was valid
  const { validateSuccess, validateMessage } = bodyIsValidWebhook(body)
  if (!validateSuccess) {
    return res
      .status(400)
      .json({ success: false, message: validateMessage });
  }

  // connect to the db pool
  const dbConnection = await db.get().getConnection();
  if (!dbConnection) {
    return res.status(500).json({ error: "failed to connect to database" });
  }

  // wrap all database queries inside a try-catch despite having express-async-errors
  try {
    // create a new webhook
    const { url } = body;
    const webhook = new WebhookClient({ url });
    await dbConnection.query(
      "INSERT INTO webhooks (webhook_id, user_id, hook_url, name) VALUES (?, (SELECT user_id FROM users WHERE user_id = ?), ?, ?)",
      [webhook.id, id, webhook.url, body.name]
    );

    // attach it's corresponding options
    const { options } = body;
    await dbConnection.query(
      "INSERT INTO webhookOptions (user_id, webhook_id, house_type, listing_type, sublet, bedrooms, low_price_range, high_price_range, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        webhook.id,
        options.house_type,
        options.listing_type,
        options.sublet,
        options.bedrooms,
        options.low_price_range,
        options.high_price_range,
        options.start_date,
        options.end_date,
      ]
    );

    // return a representation of webhook
    return res.status(201).json({
      success: true,
      webhook: {
        id: webhook.id,
        created_at: new Date().toJSON(),
      },
    });
  } catch (err) {
    res.status(502).json({ error: err });
    throw err;
  } finally {
    // ALWAYS release the db connection once finished
    await dbConnection.release();
  }
});

/**
 * Request Type - PUT
 * Purpose - Update the settings/filters of a webhook
 */
router.put("/:webhookId", async (req, res) => {
  // // Get the current users id
  // const id = BigInt(req.session.passport.user.id); // change later to CONST
  // if (!id) {
  //   return res.status(400).end();
  // }
  const id = BigInt(USER_ID);

  // Get the webhook id from url
  const { webhookId } = req.params;
  if (!webhookId) {
    return res
      .status(404)
      .json({ error: "no webhook id was provided to delete" });
  }

  // Get the request body
  const { body } = req;
  const { options } = body;


  const { validateSuccess, validateMessage } = bodyIsValidWebhook(body);
  if (!validateSuccess) {
    return res
      .status(400)
      .json({ success: false, message: validateMessage });
  }

  // Get db connection
  const dbConnection = await db.get().getConnection();
  if (!dbConnection) {
    return res.status(500).json({ error: "failed to connect to database" });
  }

  // update both tables accordingly, expecting same json as create
  console.log(options);
  try {
    const [webhook, webhookCols] = await dbConnection.query(
      "SELECT * FROM webhooks WHERE webhook_id = ? AND user_id = ?",
      [webhookId, id]
    );
    if (!webhook || webhook.length === 0) {
      throw new Error(
        "webhook.js: trying to update a webhook that does not exist"
      );
    }

    await dbConnection.query(
      "UPDATE webhooks SET name = ? WHERE webhook_id = ? AND user_id = ?",
      [body.name, webhookId, id]
    );

    await dbConnection.query(
      "UPDATE webhookOptions SET house_type = ?, listing_type = ?, sublet = ?, bedrooms = ?, low_price_range = ?, high_price_range = ?, start_date = ?, end_date = ? WHERE webhook_id = ? AND user_id = ?",
      [
        options.house_type,
        options.listing_type,
        options.sublet,
        options.bedrooms,
        options.low_price_range,
        options.high_price_range,
        options.start_date,
        options.end_date,
        webhookId,
        id,
      ]
    );
  } catch (err) {
    res.status(409).json({
      message: `failed to update record with webhook id: ${webhookId}`,
      error: err.message,
    });
    throw err;
  } finally {
    dbConnection.release();
  }
  return res.status(204).end();
});

/**
 * Request Type - DELETE
 * Purpose - Delete a webhook via id
 */
router.delete("/:webhookId", async (req, res) => {
  // // Get the current users id
  // const id = BigInt(req.session.passport.user.id); // change later to CONST
  // if (!id) {
  //   return res.status(400).end();
  // }
  const id = USER_ID;

  // Get the webhook id from url
  const { webhookId } = req.params;
  if (!webhookId) {
    return res
      .status(404)
      .json({ error: "no webhook id was provided to delete" });
  }

  // Get db connection
  const dbConnection = await db.get().getConnection();
  if (!dbConnection) {
    return res.status(500).json({ error: "failed to connect to database" });
  }

  try {
    // attempt to delete the webhookOption
    const [optionsHeader, fields] = await dbConnection.query(
      "DELETE FROM webhookOptions WHERE user_id = ? AND webhook_id = ?",
      [id, webhookId]
    );

    // delete the webhook itself
    const [webhookHeader, wFields] = await dbConnection.query(
      "DELETE FROM webhooks WHERE user_id = ? AND webhook_id = ?",
      [id, webhookId]
    );
    if (optionsHeader.affectedRows === 0 || webhookHeader.affectedRows === 0) {
      res
        .status(404)
        .json({ error: `record with webhook id: ${webhookId} does not exist` });
    }
  } catch (err) {
    res
      .status(409)
      .json({ error: `failed to delete record with webhook id: ${webhookId}` });
    throw err;
  } finally {
    dbConnection.release();
  }
  return res.status(204).end();
});

module.exports = router;
