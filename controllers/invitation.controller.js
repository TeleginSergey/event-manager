const db = require("../models");
const Invitation = db.Invitation;
const User = db.User;
const Event = db.Event;

exports.create = async (req, res) => {
    try {
        const eventId = req.body.EventId ?? req.body.eventId;
        const inviteeId = req.body.inviteeId;

        if (!eventId || !inviteeId) {
            return res.status(400).json({ message: "EventId (или eventId) и inviteeId обязательны" });
        }

        const event = await Event.findByPk(eventId);
        if (!event) return res.status(404).json({ message: "Событие не найдено" });

        if (!req.user || event.organizerId !== req.user.id) {
            return res.status(403).json({ message: "Только организатор может приглашать пользователей" });
        }

        if (inviteeId === req.user.id) {
            return res.status(400).json({ message: "Нельзя приглашать самого себя" });
        }

        const existing = await Invitation.findOne({ where: { EventId: eventId, inviteeId } });
        if (existing) {
            return res.status(409).json({ message: "Приглашение уже существует" });
        }

        const invitation = await Invitation.create({
            EventId: eventId,
            inviteeId,
            status: "pending"
        });
        res.status(201).json(invitation);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.accept = async (req, res) => {
    try {
        const invitation = await Invitation.findByPk(req.params.id);
        if (!invitation) return res.status(404).json({ message: "Приглашение не найдено" });
        if (!req.user || invitation.inviteeId !== req.user.id) {
            return res.status(403).json({ message: "Только приглашенный пользователь может принять приглашение" });
        }
        if (invitation.status !== 'pending') {
            return res.status(400).json({ message: "Нельзя изменить уже обработанное приглашение" });
        }
        await invitation.update({ status: "accepted" });
        res.json({ message: "Приглашение принято" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.decline = async (req, res) => {
    try {
        const invitation = await Invitation.findByPk(req.params.id);
        if (!invitation) return res.status(404).json({ message: "Приглашение не найдено" });
        if (!req.user || invitation.inviteeId !== req.user.id) {
            return res.status(403).json({ message: "Только приглашенный пользователь может отклонить приглашение" });
        }
        if (invitation.status !== 'pending') {
            return res.status(400).json({ message: "Нельзя изменить уже обработанное приглашение" });
        }
        await invitation.update({ status: "declined" });
        res.json({ message: "Приглашение отклонено" });
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
