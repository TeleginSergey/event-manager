const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");
const { authenticateToken, requireOwnership } = require("../middleware/auth");
const { validateEvent, validateId, validatePagination } = require("../middleware/validation");
const db = require("../models");

router.get("/", validatePagination, eventController.findAll);
router.get("/:id", validateId, eventController.findOne);

router.post("/", authenticateToken, validateEvent, eventController.create);
router.put("/:id", authenticateToken, validateId, validateEvent, requireOwnership(db.Event, 'id'), eventController.update);
router.delete("/:id", authenticateToken, validateId, requireOwnership(db.Event, 'id'), eventController.delete);

module.exports = router;
