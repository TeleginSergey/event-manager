const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticateToken } = require("../middleware/auth");
const { 
    validateUserRegistration, 
    validateUserLogin, 
    validateUserUpdate,
    validateId 
} = require("../middleware/validation");
const { authLimiter } = require("../middleware/security");

// Публичные маршруты
router.post("/register", validateUserRegistration, userController.create);
router.post("/login", authLimiter, validateUserLogin, userController.login);

// Защищенные маршруты
router.get("/profile", authenticateToken, userController.getProfile);
router.put("/profile", authenticateToken, validateUserUpdate, userController.updateProfile);

// Административные маршруты (требуют аутентификации)
router.get("/", authenticateToken, userController.findAll);
router.get("/:id", authenticateToken, validateId, userController.findOne);
router.put("/:id", authenticateToken, validateId, validateUserUpdate, userController.update);
router.delete("/:id", authenticateToken, validateId, userController.delete);

module.exports = router;
