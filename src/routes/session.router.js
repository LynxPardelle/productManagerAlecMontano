import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import passport from "passport";
const router = express.Router();
router.get("/sesion", (req, res) => {
  let username = req.session.user || "";
  if (req.session.counter) {
    req.session.counter++;
    res.send(`${username} ha visitado la página ${req.session.counter} veces`);
  } else {
    req.session.counter = 1;
    res.send(`Bienvenido ${username}`);
  }
});
router.get("/login", auth, (req, res) => {
  res.send(`Login success, ${req.session.user}!}`);
});
router.get("/logout", (req, res) => {
  console.log("logout");
  req.session.destroy((err) => {
    if (!err) res.send("Logout ok");
    else res.json({ status: "Logout ERROR", body: err });
  });
});
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);
router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  }
);
router.get("/privado", auth, (req, res) => {
  res.send("Bienvenido a la página privada, " + req.session.user);
});
export default router;
