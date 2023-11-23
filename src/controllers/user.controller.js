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
/* Recovery */
export const recoveryPassword = async (req, res) => {
  try {
    const email = await _userService.recoveryPassword(req.body.email);
    if (!email?.data)
      throw new Error(
        email?.error || "Error sending email to recover password"
      );
    req.session.recoverySuccess = true;
    res.redirect("/login");
  } catch (error) {
    req.session.recoveryFailed = true;
    req.session.recoveryFailedCause = error.message;
    res.redirect("/recovery");
  }
};
export const resetPassword = async (req, res) => {
  const { password, email, confirmPassword } = req.body;
  const token = req.query.token;
  try {
    if (req.body.password !== confirmPassword)
      throw new Error("Passwords don't match");
    const user = await _userService.resetPassword(token, password, email);
    if (!user?.data) throw new Error(user?.error || "Error resetting password");
    req.session.resetSuccess = true;
    res.redirect("/login");
  } catch (error) {
    req.session.resetFailed = true;
    req.session.resetFailedCause = error.message;
    if (
      [
        "Passwords don't match",
        "New password must be different from old password",
        "Error updating password",
      ].includes(error.message)
    ) {
      res.redirect("/reset?token=" + token);
    } else {
      res.redirect("/recover");
    }
  }
};
/* Privileges */
export const changeRoleUser = async (req, res) => {
  try {
    const user = await _userService.changeRoleUser(
      req.params.uid,
      req.params.role || "premium"
    );
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
