import express from "express";

const router = express.Router();
let testUser = {
  name: "Lynx",
  surname: "Pardelle",
  email: "lynxpardelle@lynxpardelle.com",
  role: "admin",
};
router.get("/", (req, res) => {
  res.render("index", {
    user: testUser,
    style: "styles.css",
    isAdmin: testUser.role === "admin",
  });
});

router.get("/realtimeproducts" || "products", (req, res) => {
  res.render("home", {
    style: "styles.css",
  });
});
router.get("/products", (req, res) => {
  res.render("home", {
    style: "styles.css",
  });
});

router.get("/chat", (req, res) => {
  res.render("chat", {
    user: testUser,
    style: "styles.css",
  });
});
export default router;
