"use strict";

const config = require("./utils/config");

const express = require("express");
require("express-async-errors");
const { checkAdmin } = require("./middleware/checkAdmin");
const admin = require("./routes/admin");
const dbPool = require("./models/dbConnect");
const wb = require("./utils/webhook");
const cors = require("cors");
const app = express();

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
const server = app.listen(config.app.PORT, async () => {
  await dbPool.connect(); // connect to SQL database once the application is run
  await wb.connect(); // connect to ALL Discord WebHooks related to the application
  console.log(`Server listening on PORT ${config.app.PORT}`);
});

// for shutting down database, keep track of all connecitons
let connections = [];
server.on("connection", (connection) => {
  connections.push(connection);
  connection.on(
    "close",
    () => (connections = connections.filter((curr) => curr !== connection)) // whenever a connection is closed, remove from the list
  );
});

process.on("SIGTERM", shutdownServer);
process.on("SIGINT", shutdownServer);

function shutdownServer() {
  console.log("Received termination/kill signal, shutting down server");
  server.close(() => {
    console.log(
      "SUCCESS: Closed remaining connections to the server being hosted."
    );
    process.exit(0);
  });

  setTimeout(() => {
    console.error(
      "ERROR: Forcefully shutting down server, since could not close all connections"
    );
    process.exit(1);
  }, 10000);

  connections.forEach((curr) => curr.end());
  setTimeout(() => connections.forEach((curr) => curr.destroy()), 5000);
  try {
    dbPool.get().end();
    console.log("SUCCESS: Closed all databae connections");
  } catch (err) {
    console.log(
      `ERROR: Failed to close database connection pool for reason: ${err}`
    );
  }
}
