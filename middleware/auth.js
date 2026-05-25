// middleware/auth.js

function authMiddleware(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({
      logged: false,
      error: "Não autorizado",
    });
  }

  req.user = {
    id: req.session.userId,
    name: req.session.userName,
  };

  next();
}

module.exports = authMiddleware;
