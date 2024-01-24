import UserDTO from "../dao/DTOs/user.DTO.js";
import { _userService } from "../repositories/index.repository.js";
export const sesion = (req, res) => {
  const username =
    req.session.user.first_name + " " + req.session.user.last_name;
  if (req.session.counter) {
    req.session.counter++;
    res.send(`${username} ha visitado la página ${req.session.counter} veces`);
  } else {
    req.session.counter = 1;
    res.send(`Bienvenido ${username}`);
  }
};
export const logout = async (req, res) => {
  try {
    console.log("logout");
    console.log(req.session);
    const logout = await _userService.logout(req.session);
    console.log(logout);
    if (!logout?.data) throw new Error("Error logging out user");
    console.log(logout);
    res.status(200).json(logout);
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error logging out user",
      error: error.message.replace(/"/g, "'"),
    });
  }
};
export const githubcallback = async (req, res) => {
  req.session.user = req.user;
  res.redirect("/");
};
export const privado = (req, res) => {
  res.send("Bienvenido a la página privada, " + req.session.user.first_name);
};
export const current = (req, res) => {
  try {
    let user = new UserDTO(req.session.user);
    if (!user) {
      throw new Error("User not found");
    }
    delete user.password;
    res.status(200).send(user);
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
};
