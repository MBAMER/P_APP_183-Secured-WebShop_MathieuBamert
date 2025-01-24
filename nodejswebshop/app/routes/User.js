const express = require("express");

const router = express.Router();
const controller = require("../controllers/UserController");
router.get("/", controller.get);

router.get("/login", (req, res) => {
  res.render("login", { name: "Mathieu" });
});

router.get("/register", (req, res) => {
  res.render("register", { name: "Mathieu" });
});

module.exports = router;
