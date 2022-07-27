const { Router } = require("express");

const router = new Router();

router.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard");
  }
  return res.json({ message: "TODO " });
});

module.exports = router;
