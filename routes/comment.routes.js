const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");

router.post("/", commentController.create);
router.get("/event/:eventId", commentController.findByEvent);

module.exports = router;
