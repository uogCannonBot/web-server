const checkAuthenticated = (request, response, next) => {
  if (!request.isAuthenticated()) {
    return response.redirect("/api/auth/discord");
  }
  return next();
};

module.exports = checkAuthenticated;
