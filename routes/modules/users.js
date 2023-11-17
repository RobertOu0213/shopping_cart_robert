const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user-controller");

router.get("/login", userController.loginPage);
router.post("/login", userController.login);
router.get("/register", userController.registerPage);
router.post("/register", userController.register);

module.exports = router;
