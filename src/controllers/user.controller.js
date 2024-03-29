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
export const registerUserTesting = async (req, res) => {
  try {
    const user = await _userService.registerUser(req.body);
    if (!user?.data) throw new Error("Error creating user");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error creating user",
      error: error.message.replace(/"/g, "'"),
    });
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
export const getUsers = async (req, res) => {
  try {
    const users = await _userService.getUsers();
    if (!users?.data)
      return res.status(404).send({
        status: "error",
        message: "Users not found",
        error: users?.error || users,
      });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error retrieving users",
      error: error.message.replace(/"/g, "'"),
    });
  }
};
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    console.log("email", email, "password", password);
    if (!email || !password) throw new Error("Email and password are required");
    const user = await _userService.login(email, password);
    if (!user?.data)
      return res.status(404).send({
        status: "error",
        message: "User not found",
        error: user?.error || user,
      });
    console.log("user", user);
    req.session.user = user.data;
    if (req.session.counter) {
      req.session.counter++;
    } else {
      req.session.counter = 1;
    }
    console.log("user", req.session);
    res.status(200).json(user);
  } catch (error) {
    req.session.loginFailed = true;
    req.session.registerSuccess = false;
    res.status(500).send({
      status: "error",
      message: "Error login to user",
      error: error.message.replace(/"/g, "'"),
    });
  }
};
/* Delete */
export const deleteInactiveUsers = async (req, res) => {
  try {
    const users = await _userService.deleteInactiveUsers();
    if (!users?.data)
      return res.status(404).send({
        status: "error",
        message: "Users not found",
        error: users?.error || users,
      });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error retrieving users",
      error: error.message.replace(/"/g, "'"),
    });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const user = await _userService.deleteUser(req.params.id);
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
export const loginTesting = async (req, res) => {
  try {
    const user = await _userService.login(req.body.email, req.body.password);
    if (!user?.data)
      return res.status(404).send({
        status: "error",
        message: "User not found",
        error: user?.error || user,
      });
    req.session.user = user.data;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error login user",
      error: error.message.replace(/"/g, "'"),
    });
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
/* Documents */
export const uploadDocuments = async (req, res) => {
  try {
    const user = await _userService.uploadDocuments(
      req.params.uid,
      req.files,
      req.body.documents
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
