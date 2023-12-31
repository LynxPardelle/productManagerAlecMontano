import express from "express";

const router = express.Router();
router.get("/", auth, (req, res) => {
  res.render("index", {
    isAdmin: req.session?.user?.role === "admin",
    user: req.session.user,
    style: "styles.css",
  });
});
router.get("/login", logged, (req, res) => {
  res.render("login", {
    user: req.session?.user || "",
    isAdmin: req.session?.user?.role === "admin",
    style: "styles.css",
    loginFailed: req.session?.loginFailed ?? false,
    registerSuccess: req.session?.registerSuccess ?? false,
    recoverySuccess: req.session?.recoverySuccess ?? false,
    resetSuccess: req.session?.resetSuccess ?? false,
  });
});
router.get("/recovery", logged, (req, res) => {
  res.render("recovery", {
    isAdmin: req.session?.user?.role === "admin",
    user: req.session.user || undefined,
    style: "styles.css",
    recoveryFailed: req.session?.recoveryFailed ?? false,
    recoveryFailedCause: req.session?.recoveryFailedCause ?? "",
    resetFailed: req.session?.resetFailed ?? false,
    resetFailedCause: req.session?.resetFailedCause ?? "",
  });
});
router.get("/reset", logged, (req, res) => {
  res.render("reset", {
    user: req.session.user || undefined,
    isAdmin: req.session?.user?.role === "admin",
    style: "styles.css",
    token: req.query.token,
    resetFailed: req.session?.resetFailed ?? false,
    resetFailedCause: req.session?.resetFailedCause ?? "",
  });
});
router.get("/register", logged, (req, res) => {
  res.render("register", {
    user: req.session.user || undefined,
    isAdmin: req.session?.user?.role === "admin",
    style: "styles.css",
    registerFailed: req.session?.registerFailed ?? false,
  });
});

router.get("/realtimeproducts", (req, res) => {
  res.render("home", {
    user: req.session.user || undefined,
    isAdmin: req.session?.user?.role === "admin",
    style: "styles.css",
  });
});
router.get("/products", auth, (req, res) => {
  res.render("home", {
    user: req.session?.user,
    isAdmin: req.session?.user?.role === "admin",
    style: "styles.css",
  });
});
router.get("/cart", auth, (req, res) => {
  res.render("cart", {
    user: req.session?.user,
    isAdmin: req.session?.user?.role === "admin",
    style: "styles.css",
  });
});
router.get("/perfil", auth, (req, res) => {
  res.render("perfil", {
    user: req.session?.user,
    isAdmin: req.session?.user?.role === "admin",
    style: "styles.css",
  });
});
router.get("/chat", auth, (req, res) => {
  res.render("chat", {
    user: req.session.user || undefined,
    isAdmin: req.session?.user?.role === "admin",
    style: "styles.css",
  });
});
router.get("/users", isAdmin, (req, res) => {
  res.render("users", {
    user: req.session?.user,
    isAdmin: req.session?.user?.role === "admin",
    style: "styles.css",
  });
});
router.get("/user", isAdmin, (req, res) => {
  res.render("user", {
    user: req.session?.user,
    uid: req.query.id,
    isAdmin: req.session?.user?.role === "admin",
    style: "styles.css",
  });
});
function auth(req, res, next) {
  req.logger.debug(req.session);
  if (!req.session?.user) {
    return res.redirect("/login");
  }
  next();
}
function logged(req, res, next) {
  if (req.session?.user) {
    return res.redirect("/");
  }
  next();
}
function isAdmin(req, res, next) {
  if (req.session?.user?.role !== "admin") {
    return res.redirect("/");
  }
  next();
}
export default router;
