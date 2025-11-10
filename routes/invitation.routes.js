const express = require("express");
const router = express.Router();
const invitationController = require("../controllers/invitation.controller");
const { authenticateToken } = require("../middleware/auth");
const { validateId, validateUserIdParam } = require("../middleware/validation");

router.post("/", authenticateToken, invitationController.create);
router.post("/:id/accept", authenticateToken, validateId, invitationController.accept);
router.post("/:id/decline", authenticateToken, validateId, invitationController.decline);
router.get("/user/:userId", authenticateToken, validateUserIdParam, invitationController.findForUser);

module.exports = router;
