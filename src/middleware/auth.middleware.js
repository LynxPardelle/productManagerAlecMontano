import passport from "passport";
export function auth(req, res, next) {
  const { username, password } = req.query;
  if (username !== "admin" && password !== "1234") {
    return res.status(401).send("Unauthorized");
  }
  req.session.user = username;
  req.session.admin = true;
  next();
}

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res.status(401).send({
          error: info.messages ? info.messages : info.toString(),
        });
      }

      req.user = user;
      next();
    })(req, res, next);
  };
};
