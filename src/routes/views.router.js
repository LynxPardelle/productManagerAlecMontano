import express from "express";

const router = express.Router();
router.get("/", auth, (req, res) => {
  res.render("index", {
    user: req.session.user,
    style: "styles.css",
  });
});

router.get("/login", logged, (req, res) => {
  res.render("login", {
    style: "styles.css",
    loginFailed: req.session?.loginFailed ?? false,
    registerSuccess: req.session?.registerSuccess ?? false,
  });
});
router.get("/register", logged, (req, res) => {
  res.render("register", {
    style: "styles.css",
    registerFailed: req.session?.registerFailed ?? false,
  });
});

router.get("/realtimeproducts", (req, res) => {
  res.render("home", {
    style: "styles.css",
  });
});
router.get("/products", auth, (req, res) => {
  res.render("home", {
    user: req.session?.user,
    style: "styles.css",
  });
});
router.get("/cart", auth, (req, res) => {
  res.render("cart", {
    user: req.session?.user,
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
    style: "styles.css",
  });
});
function auth(req, res, next) {
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
export default router;
