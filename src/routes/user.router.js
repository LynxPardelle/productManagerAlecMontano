import express from "express";
import {
  changeRoleUser,
  getUser,
  login,
  loginTesting,
  recoveryPassword,
  registerUser,
  registerUserTesting,
  resetPassword,
} from "../controllers/user.controller.js";
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", login);
router.post("/register-test", registerUserTesting);
router.post("/login-test", loginTesting);
router.get("/user/:id", getUser);
router.post("/recovery", recoveryPassword);
router.post("/reset", resetPassword);
router.put("/changeRole/:role/:uid", changeRoleUser);
router.put(":role/:uid", changeRoleUser);
router.put("/premium/:uid", changeRoleUser);

export default router;
