export function auth(req, res, next) {
  const { username, password } = req.query;
  if (username !== "admin" && password !== "1234") {
    return res.status(401).send("Unauthorized");
  }
  req.session.user = username;
  req.session.admin = true;
  next();
}
