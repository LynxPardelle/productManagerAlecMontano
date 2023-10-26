import { _userService } from "../repositories/index.repository.js";

/* Create */
export const registerUser = async (req, res) => {
  try {
    const user = await _userService.registerUser(req.body);
    if (!user?.data) throw new Error("Error creating user");
    req.session.registerSuccess = true;
    res.redirect("/login");
  } catch (error) {
    req.session.registerFailed = true;
    res.redirect("/register");
  }
};
/* Read */
export const getUser = async (req, res) => {
  try {
    const user = await _userService.getUser(req.params.id);
    if (!user?.data)
      return res.status(404).send({
        status: "error",
        message: "User not found",
        error: user?.error || user,
      });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error retrieving user",
      error: error.message.replace(/"/g, "'"),
    });
  }
};
export const login = async (req, res) => {
  try {
    const user = await _userService.login(req.body.email, req.body.password);
    if (!user?.data)
      return res.status(404).send({
        status: "error",
        message: "User not found",
        error: user?.error || user,
      });
    req.session.user = user.data;
    res.redirect("/products");
  } catch (error) {
    req.session.loginFailed = true;
    req.session.registerSuccess = false;
    res.redirect("/login");
  }
};
