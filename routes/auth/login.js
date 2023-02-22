const { Router } = require("express");
const { app } = require("../../utils/config");
const passport = require("passport");

const router = new Router();

router.get("/login/success", (req, res) => {
  if (req.user) {
    return res.status(200).json({
      success: true,
      message: "successful",
      user: req.user,
    });
  }
  return res.redirect("/api/auth/login/failed");
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "login was cancelled or failed abruptly",
  });
});

router.get("/logout", async (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    return res.json({ success: true });
  });
});

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
  passport.authenticate("discord", {
    successRedirect: app.URL,
    failureRedirect: "/api/auth/login/failed",
  })
);

module.exports = router;
