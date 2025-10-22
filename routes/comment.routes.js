const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const { authenticateToken } = require("../middleware/auth");
const { validateComment, validateId } = require("../middleware/validation");

router.get("/event/:eventId", validateId, commentController.findByEvent);

router.post("/", authenticateToken, validateComment, commentController.create);

module.exports = router;
