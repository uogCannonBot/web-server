const checkAuthenticated = (request, response, next) => {
  if (!request.isAuthenticated()) {
    return response.redirect("/login");
  }
  return next();
};

module.exports = checkAuthenticated;
