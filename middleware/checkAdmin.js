require("dotenv").config();

const bcrypt = require("bcryptjs");

const checkAdmin = (request, response, next) => {
  if (!request.body || !request.body.PASSWORD) {
    return response.status(404).end();
  }

  const { PASSWORD } = request.body;
  bcrypt.compare(PASSWORD, process.env.HASH, (err, res) => {
    if (err) {
      return response.status(404).end();
    }
    if (res) {
      return response.json({ success: true });
    } else {
      return response.json({
        success: false,
        message: "Invalid password provided",
      });
    }
  });
};

module.exports = {
  checkAdmin,
};
