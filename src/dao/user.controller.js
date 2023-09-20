import userModel from "./models/user.model.js";
import crypto from "crypto";
import { isValidPassword } from "../utils/crypts.js";

export const UserController = {
  async getUser(req, res) {
    try {
      const uid = req.params.id;
      const user = await userModel.DoGetUser({ _id: uid });
      if (!user) {
        throw new Error("User not found");
      }
      res.status(200).send({
        status: "success",
        message: "User retrieved successfully",
        data: user,
      });
    } catch (error) {
      res.status(500).send({
        status: "error",
        message: "Error retrieving user",
        error: error.message.replace(/"/g, "'"),
      });
    }
  },
  async DoGetUser(json) {
    try {
      const user = await userModel.findOne(json);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      return error;
    }
  },
  async registerUser(req, res) {
    try {
      const result = await doRegisterUser(req.body);
      if (!result) {
        throw new Error("Error creating user");
      }
      /* res.status(201).send({
        status: "success",
        message: "User added successfully",
        data: result,
      }); */
      req.session.registerSuccess = true;
      res.redirect("/login");
    } catch (error) {
      /* res.status(500).send({
        status: "error",
        message: "Error creating user",
        error: error.message.replace(/"/g, "'"),
      }); */
      req.session.registerFailed = true;
      res.redirect("/register");
    }
  },
  async DoRegisterUser(json) {
    try {
      let { first_name, last_name, email, age, password } = json;
      /* password = await getHash(password); */
      if (email === "adminCoder@coder.com")
        throw new Error("User already exists");
      const result = await userModel.create({
        first_name: first_name,
        last_name: last_name,
        email: email,
        age: age,
        password: password,
        role: email === "adminCoder@coder.com" ? "admin" : "usuario",
      });
      if (!result) {
        throw new Error("Error creating user");
      }
      return result;
    } catch (error) {
      return error;
    }
  },
  async login(req, res) {
    try {
      const { email, password } = req.body;
      console.log(email, password);
      if (email === "adminCoder@coder.com") {
        if (password !== "adminCod3r123") throw new Error("User not found");
        req.session.user = {
          first_name: "admin",
          last_name: "coder",
          email: "adminCoder@coder.com",
          age: 99,
          role: "admin",
        };
      } else {
        const user = await userModel.find({ email: email });
        if (
          !user.length > 0 &&
          user[0].password !== isValidPassword(user[0].password, password)
        ) {
          throw new Error("User not found");
        }
        const { first_name, last_name, age, role } = user[0];
        req.session.user = {
          first_name: first_name,
          last_name: last_name,
          email: email,
          age: age,
          role: role,
        };
        /* res.status(200).send({
          status: "success",
          message: "User retrieved successfully",
          data: user[0],
        }); */
      }
      req.session.loginFailed = false;
      res.redirect("/products");
    } catch (error) {
      /* res.status(500).send({
        status: "error",
        message: "Error retrieving user",
        error: error.message.replace(/"/g, "'"),
      }); */
      req.session.loginFailed = true;
      req.session.registerSuccess = false;
      res.redirect("/login");
    }
  },
};
