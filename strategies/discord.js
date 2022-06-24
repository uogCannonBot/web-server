"use strict";

const { discord } = require("../utils/config");

const passport = require("passport");
const { Strategy } = require("passport-discord");

passport.use(
  new Strategy(
    {
      clientID: discord.CLIENT_ID,
      clientSecret: discord.CLIENT_SECRET,
      callbackURL: "http://localhost:8080/api/auth/discord/redirect",
      scope: ["identify", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Authenticated with Access Token: ", accessToken);
    }
  )
);
