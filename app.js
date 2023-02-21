"use strict";

const config = require("./utils/config");

// Dependencies
const express = require("express");
const session = require("express-session");
const passport = require("passport");
require("express-async-errors");
const cors = require("cors");
const morgan = require("morgan");

// sub-routines/classes
const { checkAdmin } = require("./middleware/checkAdmin");
const listingsRoute = require("./routes/admin");
const authRoute = require("./routes/auth/login");
const webhookRoute = require("./routes/webhook");
const dbPool = require("./models/dbConnect");
const wb = require("./utils/webhook");

const app = express();

console.log("NODE_ENV=", process.env.NODE_ENV);

require("./strategies/discord");

// Middleware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cors({ origin: config.app.URL, credentials: true }));
app.use(
  session({
    secret: config.app.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoute);
// app.all("/admin/*", checkAdmin, (request, response, next) => {
//   next();
// });
app.use("/api/admin", listingsRoute);
app.use("/api/webhook", webhookRoute);

app.use((req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
}); // generic route (ALWAYS KEEP LAST)

// logger last
app.use(morgan("dev"));

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
