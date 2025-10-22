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

router.post("/register", validateUserRegistration, userController.create);
router.post("/login", authLimiter, validateUserLogin, userController.login);


router.get("/profile", authenticateToken, userController.getProfile);
router.put("/profile", authenticateToken, validateUserUpdate, userController.updateProfile);

router.get("/", authenticateToken, userController.findAll);
router.get("/:id", authenticateToken, validateId, userController.findOne);
router.put("/:id", authenticateToken, validateId, validateUserUpdate, userController.update);
router.delete("/:id", authenticateToken, validateId, userController.delete);

module.exports = router;
