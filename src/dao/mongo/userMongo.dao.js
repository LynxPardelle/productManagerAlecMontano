import userModel from "./models/user.model.js";
import { createHash, isValidPassword } from "../../utils/crypts.js";
import emailService from "../../services/mail/mail.js";
import jwt from "jsonwebtoken";
import config from "../../config/config.js";
const fs = "fs";
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
  async getUsers() {
    try {
      const users = await userModel.find();
      if (!users) {
        throw new Error("Users not found");
      }
      return {
        status: "success",
        message: "Users retrieved successfully",
        data: users.map((user) => {
          const { first_name, last_name, email, role, documents, id } = user;
          return {
            id: id,
            name: first_name + " " + last_name,
            email: email,
            role: role || "usuario",
            documents:
              !!documents && documents.length > 0
                ? documents.map((doc) => {
                    return {
                      type: doc.type,
                      file: doc.file,
                    };
                  })
                : [],
          };
        }),
      };
    } catch (error) {
      return {
        status: "error",
        message: "Error retrieving users",
        error: error.message.replace(/"/g, "'"),
      };
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
        user.last_connection = Date.now();
        const userUpdated = await userModel.updateOne({ email: email }, user);
        if (!userUpdated) {
          throw new Error("Error updating user");
        }
        const { first_name, last_name, age, role, documents } = user;
        return {
          status: "success",
          message: "User retrieved successfully",
          data: {
            first_name: first_name,
            last_name: last_name,
            email: email,
            age: age,
            role: role,
            documents,
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
  /* Delete */
  async deleteInactiveUsers() {
    try {
      const users = await userModel.find();
      if (!users) {
        throw new Error("Users not found");
      }
      const usersDeleted = await userModel.deleteMany({
        last_connection: { $lt: Date.now() - 172800000 /* 2 days */ },
      });
      if (!usersDeleted) {
        throw new Error("Error deleting users");
      }
      for (let i = 0; i < usersDeleted.length; i++) {
        const user = usersDeleted[i];
        if (!user.documents) continue;
        for (let j = 0; j < user.documents.length; j++) {
          const document = user.documents[j];
          fs.unlinkSync(document.file);
        }
        /* Send email */
        const emailBody = `
          <h1>Eliminación de usuario</h1>
          <p>Estimado ${user.first_name} ${user.last_name},</p>
          <p>Le informamos que su cuenta ha sido eliminada por inactividad.</p>
        `;
        const emailResult = await emailService(
          user.email,
          "Eliminación de usuario por inactividad",
          emailBody
        );
        if (!emailResult) {
          throw new Error("Error sending email");
        }
        console.info(emailResult);
      }
      return {
        status: "success",
        message: "Users deleted successfully",
        data: usersDeleted,
      };
    } catch (error) {
      return {
        status: "error",
        message: "Error deleting users",
        error: error.message.replace(/"/g, "'"),
      };
    }
  },
  async deleteUser(id) {
    try {
      const user = await this.DoGetUser({ _id: id });
      if (!user) {
        throw new Error("User not found");
      }
      if (user.documents) {
        for (let i = 0; i < user.documents.length; i++) {
          const document = user.documents[i];
          fs.unlinkSync(document.file);
        }
      }
      /* Delete user */
      const userDeleted = await userModel.deleteOne({ _id: id });
      if (!userDeleted) {
        throw new Error("Error deleting user");
      }
      /* Send email */
      const emailBody = `
        <h1>Eliminación de usuario</h1>
        <p>Estimado ${user.first_name} ${user.last_name},</p>
        <p>Le informamos que su cuenta ha sido eliminada.</p>
      `;
      const emailResult = await emailService(
        user.email,
        "Eliminación de usuario",
        emailBody
      );
      if (!emailResult) {
        throw new Error("Error sending email");
      }
      console.info(emailResult);
      return {
        status: "success",
        message: "User deleted successfully",
        data: userDeleted,
      };
    } catch (error) {
      return {
        status: "error",
        message: "Error deleting user",
        error: error.message.replace(/"/g, "'"),
      };
    }
  },
  async logout(session) {
    try {
      const user = await userModel.findOne({ email: req.session.email });
      if (!user) {
        throw new Error("User not found");
      }
      user.last_connection = Date.now();
      const userUpdated = await userModel.updateOne(
        { email: session.email },
        user
      );
      if (!userUpdated) {
        throw new Error("Error updating user");
      }
      session.destroy((err) => {
        if (!err) res.send("Logout ok");
        else res.json({ status: "Logout ERROR", body: err });
      });
      return {
        status: "success",
        message: "User logged out successfully",
        data: userUpdated.last_connection,
      };
    } catch (error) {
      return {
        status: "error",
        message: "Error logging out user",
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
        <a href="${config.origin}/reset?token=${token}">Recuperar contraseña</a>
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
      if (
        role === "premium" &&
        (!user.documents ||
          user.documents.length <= 2 ||
          !user.documents.find((doc) => doc.type === "Identificación") ||
          !user.documents.find(
            (doc) => doc.type === "Comprobante de domicilio"
          ) ||
          !user.documents.find(
            (doc) => doc.type === "Comprobante de estado de cuenta"
          ))
      ) {
        throw new Error("User has no required documents");
      }
      const userUpdated = await userModel.updateOne(
        { _id: id },
        {
          role: ["admin", "usuario", "premium"].includes(role)
            ? role
            : "usuario",
        }
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
  /* Documents */
  async uploadDocuments(id, files, documents) {
    try {
      const user = await this.DoGetUser({ _id: id });
      if (!user) {
        throw new Error("User not found");
      }
      if (!files || !documents) {
        throw new Error("No files or documents provided");
      }
      if (files.length !== documents.length) {
        throw new Error("Files and documents don't match");
      }
      const userDocuments = user.documents || [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const document = documents[i];
        if (!file || !document) {
          throw new Error("No file or document provided");
        }
        if (
          !["Identificación", "Comprobante de domicilio"].includes(document)
        ) {
          throw new Error("Invalid document type");
        }
        if (!file.mimetype.includes("image")) {
          throw new Error("Invalid file type");
        }
        const prevDocument = userDocuments.find((doc) => doc.type === document);
        if (prevDocument) {
          fs.unlinkSync(prevDocument.file);
          userDocuments.splice(userDocuments.indexOf(prevDocument), 1);
        }
        userDocuments.push({
          type: document,
          file: `${__dirname}/../public/documents/${file.filename}`,
        });
      }
      const userUpdated = await userModel.updateOne(
        { _id: id },
        { documents: userDocuments }
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
