const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");

router.post("/", eventController.create);
router.get("/", eventController.findAll);
router.get("/:id", eventController.findOne);
router.put("/:id", eventController.update);
router.delete("/:id", eventController.delete);

module.exports = router;
