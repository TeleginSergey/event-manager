const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const { authenticateToken } = require("../middleware/auth");
const { validateComment, validateEventIdParam } = require("../middleware/validation");

router.get("/event/:eventId", validateEventIdParam, commentController.findByEvent);

router.post("/", authenticateToken, validateComment, commentController.create);

module.exports = router;
