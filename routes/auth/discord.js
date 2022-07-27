const { Router } = require("express");
const passport = require("passport");

const router = Router();

// GET to authenticate a user with discord
router.get(
  "/discord",
  passport.authenticate("discord", { permissions: 536870912 }),
  (req, res) => {
    res.send(200);
  }
);

// GET to redirect the user once authenticated
router.get(
  "/discord/redirect",
  passport.authenticate("discord", { failureRedirect: "/" }),
  // callback once authenticated
  (req, res) => {
    res.redirect("/dashboard");
  }
);

module.exports = router;
