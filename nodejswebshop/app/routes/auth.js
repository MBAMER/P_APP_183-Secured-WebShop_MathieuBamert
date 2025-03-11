const express = require("express");

const authRouter = express.Router();
const controller = require("../controllers/AuthController");

authRouter.get("/", controller.get);
authRouter.get("/login", (req, res) => {
  res.render("login", {});
});

authRouter.get("/register", (req, res) => {
  res.render("register", {});
});
//router.get("/login", (req, res));

authRouter.post("/login", controller.loginUser);

authRouter.get("/register", controller.getregister);

authRouter.get("/home", controller.verifyToken, controller.displayHome);

authRouter.post("/register", controller.createUser);

module.exports = authRouter;
