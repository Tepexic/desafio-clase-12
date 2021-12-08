/**
 * Middleware para comprobar si el usuario está logueado
 */
function auth(req, res, next) {
  if (req.session?.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

module.exports = auth;
