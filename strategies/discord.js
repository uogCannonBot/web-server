/**
 * TODO: Once a user has been authenticated, check if they
 * are already in the users database. IF NOT, add, otherwise continue
 * to grant them privileges.
 *
 * TODO: Privileges are contained within the following scopes:
 * - creating webhooks to be attached to servers
 * - modifying options of webhooks
 *
 * TODO: Change the process in which notifications are sent.
 * Go through all webhooks -> Go through each of their options -> Send notification if option satisfies any of the listings found TODAY
 *
 */

"use strict";

const { discord } = require("../utils/config");
const db = require("../models/dbConnect");

const passport = require("passport");
const { Strategy } = require("passport-discord");

// for whenever we're serializing a session to a user
// ie. logging in/registering
passport.serializeUser((user, done) => {
  done(null, user);
});

// for whenever we're de-serializing a session for a user
// ie. logging out
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new Strategy(
    {
      clientID: discord.CLIENT_ID,
      clientSecret: discord.CLIENT_SECRET,
      callbackURL: "/api/auth/discord/redirect",
      scope: ["identify", "email"],
    },
    // verify callback function
    async (accessToken, refreshToken, profile, done) => {
      console.log("Authenticated with Access Token: ", accessToken);
      console.log(profile);

      // Check if a user exists in the User database using db connection
      const dbConnection = await db.get().getConnection();
      if (!dbConnection) {
        return done({ error: "Failed to connect to database" }, profile);
      }
      const [userRows, userCols] = await dbConnection.query(
        "SELECT * FROM users WHERE user_id = ?",
        [profile.id]
      );

      // IF USER DNE in User DB, Add them to the database
      if (!userRows || userRows.length === 0) {
        await dbConnection.query(
          "INSERT INTO users (user_id, avatar_id, email) VALUES (?, ?, ?)",
          [profile.id, profile.avatar, profile.email]
        );
      }
      // IF USER EXISTS, JUST FINISH
      // call done to complete authentication
      return done(null, profile);
    }
  )
);
