import userModel from "./models/user.model.js";
import { createHash, isValidPassword } from "../../utils/crypts.js";
import emailService from "../../services/mail/mail.js";
import jwt from "jsonwebtoken";
import config from "../../config/config.js";
export default {
  /* Create */
  async registerUser(user) {
    try {
      const newUser = await this.DoRegisterUser(user);
      if (!newUser) {
        throw new Error("Error creating user");
      }
      return {
        status: "success",
        message: "User registered successfully",
        data: newUser,
      };
    } catch (error) {
      console.error(error);
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
      const user = await this.DoGetUser({ _id: id });
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
        console.log(user);
        console.log(email);
        console.log(password);
        console.log(isValidPassword(user, password));
        if (!user && user.password !== isValidPassword(user, password)) {
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
  /* Recovery */
  async recoveryPassword(email) {
    try {
      const user = await this.DoGetUser({ email: email });
      if (!user) {
        throw new Error("User not found");
      }
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
        },
        config.secret,
        {
          expiresIn: "1h",
        }
      );
      const emailBody = `
        <h1>Recuperación de contraseña</h1>
        <p>Estimado ${user.first_name} ${user.last_name},</p>
        <p>Para recuperar su contraseña, haga click en el siguiente enlace:</p>
        <a href="http://localhost:8080/reset?token=${token}">Recuperar contraseña</a>
        <p>Si no solicitó recuperar su contraseña, por favor ignore este mensaje.</p>
      `;
      const emailResult = await emailService(
        user.email,
        "Recuperación de contraseña",
        emailBody
      );
      if (!emailResult) {
        throw new Error("Error sending email");
      }
      console.info(emailResult);
      return {
        status: "success",
        message: "User retrieved successfully",
        data: emailResult,
      };
    } catch (error) {
      return {
        status: "error",
        message: "Error retrieving user",
        error: error.message.replace(/"/g, "'"),
      };
    }
  },
  async resetPassword(token, password, email) {
    try {
      const user = await this.DoGetUser({ email: email });
      if (!user) {
        throw new Error("User not found");
      }
      const decoded = jwt.verify(token, config.secret);
      if (decoded.email !== email) {
        throw new Error("Invalid token");
      }
      let today = new Date();
      let exp = new Date(decoded.exp * 1000);
      if (exp < today) {
        throw new Error("Expired token");
      }
      if (isValidPassword(user, password)) {
        throw new Error("New password must be different from old password");
      }
      let hashedPassword = createHash(password);
      const userUpdated = await userModel.updateOne(
        { email: email },
        { password: hashedPassword }
      );
      if (!userUpdated) {
        throw new Error("Error updating password");
      }
      return {
        status: "success",
        message: "User retrieved successfully",
        data: userUpdated,
      };
    } catch (error) {
      return {
        status: "error",
        message: "Error retrieving user",
        error: error.message.replace(/"/g, "'"),
      };
    }
  },
  /* Privileges */
  async changeRoleUser(id, role) {
    try {
      const user = await this.DoGetUser({ _id: id });
      if (!user) {
        throw new Error("User not found");
      }
      const userUpdated = await userModel.updateOne(
        { _id: id },
        { role: user.role === role ? "user" : role }
      );
      if (!userUpdated) {
        throw new Error("Error updating user");
      }
      return {
        status: "success",
        message: "User retrieved successfully",
        data: userUpdated,
      };
    } catch (error) {
      return {
        status: "error",
        message: "Error retrieving user",
        error: error.message.replace(/"/g, "'"),
      };
    }
  },
};
