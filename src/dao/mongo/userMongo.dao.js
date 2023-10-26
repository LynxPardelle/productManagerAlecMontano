import userModel from "./models/user.model.js";
import { isValidPassword } from "../../utils/crypts.js";

export default {
  /* Create */
  async registerUser(user) {
    try {
      const newUser = await DoRegisterUser(user);
      if (!newUser) {
        throw new Error("Error creating user");
      }
      return {
        status: "success",
        message: "User registered successfully",
        data: newUser,
      };
    } catch (error) {
      return {
        status: "error",
        message: "Error creating user",
        error: error.message.replace(/"/g, "'"),
      };
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
  /* Read */
  async getUser(id) {
    try {
      const user = await DoGetUser({ _id: id });
      if (!user) {
        throw new Error("User not found");
      }
      return {
        status: "success",
        message: "User retrieved successfully",
        data: user,
      };
    } catch (error) {
      return {
        status: "error",
        message: "Error retrieving user",
        error: error.message.replace(/"/g, "'"),
      };
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
  async login(email, password) {
    try {
      if (email === "adminCoder@coder.com") {
        if (password !== "adminCod3r123") throw new Error("User not found");
        user = {
          first_name: "admin",
          last_name: "coder",
          email: "adminCoder@coder.com",
          age: 99,
          role: "admin",
        };
        return {
          status: "success",
          message: "User retrieved successfully",
          data: user,
        };
      } else {
        const user = await userModel.findOne({ email: email });
        if (
          !user &&
          user.password !== isValidPassword(user.password, password)
        ) {
          throw new Error("User not found");
        }
        const { first_name, last_name, age, role } = user;
        return {
          status: "success",
          message: "User retrieved successfully",
          data: {
            first_name: first_name,
            last_name: last_name,
            email: email,
            age: age,
            role: role,
          },
        };
      }
    } catch (error) {
      return {
        status: "error",
        message: "Error retrieving user",
        error: error.message.replace(/"/g, "'"),
      };
    }
  },
};
