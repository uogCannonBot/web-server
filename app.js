"use strict";

require("dotenv").config();

const express = require("express");
const { checkAdmin } = require("./middleware/checkAdmin");
const admin = require("./routes/admin");
const db = require("./models/dbConnect");
const wb = require("./utils/webhook");
const cors = require("cors");
const app = express();

/**
 *
 * TODO: Run the parser script on the server every 5 minutes (1000 * 60 * 5)
 * TODO: For every INSERT query to be made, iterate through all the "saved searches" and check
 * if those searches match the current listing being added
 * TODO: Alert the user afterwards using front-end (send a request from the back-end to do so)
 */

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.all("/admin/*", checkAdmin, (request, response, next) => {
  next();
});

// Routes
app.post("/admin/listings", admin.load);

// Start
app.listen(process.env.PORT, async () => {
  await db.connect(); // connect to SQL database once the application is run
  await wb.connect();
  console.log(`Server listening on PORT ${process.env.PORT}`);
});
