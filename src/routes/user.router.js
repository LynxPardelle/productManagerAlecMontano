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
  uploadDocuments,
  getUsers,
  deleteInactiveUsers,
  deleteUser,
} from "../controllers/user.controller.js";
import uploader from "../utils/uploader.js";
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", login);
router.post("/register-test", registerUserTesting);
router.post("/login-test", loginTesting);
router.get("/user/:id", getUser);
router.get("/", getUsers);
router.post("/recovery", recoveryPassword);
router.post("/reset", resetPassword);
router.put("/changeRole/:role/:uid", changeRoleUser);
router.put(":role/:uid", changeRoleUser);
router.put("/premium/:uid", changeRoleUser);
router.post(":uid/documents", uploader("documentos", "array"), uploadDocuments);
router.delete("/", deleteInactiveUsers);
router.delete("/:uid", deleteUser);
export default router;
