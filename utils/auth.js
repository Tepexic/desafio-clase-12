/**
 * Middleware para comprobar si el usuario está logueado
 */
const auth = function auth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
};

const apiAuth = function (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ error: "no autenticado!" });
  }
};

module.exports = auth;
