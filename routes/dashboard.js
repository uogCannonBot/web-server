const { Router } = require("express");
const checkAuthenticated = require("../middleware/checkAuthenticated");

const router = new Router();

router.get("/", checkAuthenticated, (req, res) => {
  res.json({ message: "TODO: Dashboard" });
});

router.get("/logout", async (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

module.exports = router;
