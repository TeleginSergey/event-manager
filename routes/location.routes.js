const express = require("express");
const router = express.Router();
const locationController = require("../controllers/location.controller");

router.post("/", locationController.create);
router.get("/", locationController.findAll);

module.exports = router;
