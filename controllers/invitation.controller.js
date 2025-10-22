const db = require("../models");
const Invitation = db.Invitation;
const User = db.User;
const Event = db.Event;

exports.create = async (req, res) => {
    try {
        const invitation = await Invitation.create({
            EventId: req.body.EventId,
            inviteeId: req.body.inviteeId,
            status: "pending" // pending, accepted, declined
        });
        res.status(201).json(invitation);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.accept = async (req, res) => {
    try {
        const invitation = await Invitation.findByPk(req.params.id);
        if (!invitation) return res.status(404).json({ message: "Invitation not found" });
        await invitation.update({ status: "accepted" });
        res.json({ message: "Invitation accepted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.decline = async (req, res) => {
    try {
        const invitation = await Invitation.findByPk(req.params.id);
        if (!invitation) return res.status(404).json({ message: "Invitation not found" });
        await invitation.update({ status: "declined" });
        res.json({ message: "Invitation declined" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.findForUser = async (req, res) => {
    try {
        const invitations = await Invitation.findAll({
            where: { inviteeId: req.params.userId },
            include: [Event]
        });
        res.json(invitations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
