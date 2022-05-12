require("dotenv").config();

const express = require("express");
const { checkAdmin } = require("./middleware/checkAdmin");
const admin = require("./routes/admin");
const db = require("./db/dbConnect");
const cors = require("cors");
const app = express();

/**
 *
 * TODO: Connect to SQL database
 *        - Initially populate the database ONLY once (upon server setup)
 * TODO: Run the parser script on the server every 5 minutes (1000 * 60 * 5)
 * TODO: For every INSERT query to be made, iterate through all the "saved searches" and check
 * if those searches match the current listing being added
 * TODO: Alert the user afterwards using front-end (send a request from the back-end to do so)
 */

// Middleware
app.use(express.json());
app.use(cors());
app.all("/admin/*", checkAdmin, (request, response, next) => {
  next();
});

// Routes
app.post("/admin/listings", admin.load);

// Start

app.listen(process.env.PORT, async () => {
  await db.connect();
  console.log(`Server listening on PORT ${process.env.PORT}`);
});
