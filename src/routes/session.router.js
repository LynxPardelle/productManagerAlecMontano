import express from "express";
import { auth, authAdmin } from "../middleware/auth.middleware.js";
import passport from "passport";
import {
  current,
  githubcallback,
  logout,
  privado,
  sesion,
} from "../controllers/session.controller.js";
import { login } from "./../controllers/user.controller.js";
const router = express.Router();
router.get("/sesion", auth, sesion);
router.get("/login", login);
router.get("/logout", auth, logout);
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  githubcallback
);
router.get("/privado", authAdmin, privado);
router.get("/current", auth, current);
export default router;
