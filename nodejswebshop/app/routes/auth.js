const express = require("express");

const router = express.Router();
const controller = require("../controllers/AuthController");

router.get("/", controller.get);

//router.get("/login", (req, res));

router.get("/register", controller.getregister);

router.post("/register", controller.createUser);

module.exports = router;
