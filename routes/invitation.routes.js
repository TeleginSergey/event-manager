const express = require("express");
const router = express.Router();
const invitationController = require("../controllers/invitation.controller");

router.post("/", invitationController.create);
router.post("/:id/accept", invitationController.accept);
router.post("/:id/decline", invitationController.decline);
router.get("/user/:userId", invitationController.findForUser);

module.exports = router;
