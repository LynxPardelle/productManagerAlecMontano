import passport from "passport";
export function auth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).send("Unauthorized");
  }
  next();
}

export function authAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(401).send("Unauthorized");
  }
  next();
}

export function authPremium(req, res, next) {
  if (
    !req.session.user ||
    (req.session.user.role !== "admin" && req.session.user.role !== "premium")
  ) {
    return res.status(401).send("Unauthorized");
  }
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
