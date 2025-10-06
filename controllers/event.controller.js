const db = require("../models");
const Event = db.Event;
const User = db.User;
const Category = db.Category;
const Location = db.Location;

exports.create = async (req, res) => {
    try {
        const event = await Event.create({
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            organizerId: req.body.organizerId,
            CategoryId: req.body.CategoryId,
            LocationId: req.body.LocationId,
        });
        res.status(201).json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.findAll = async (req, res) => {
    try {
        const events = await Event.findAll({
            include: [
                { model: User, as: "organizer", attributes: ["id", "name", "email"] },
                Category,
                Location,
            ],
            order: [['date', 'ASC']],
        });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.findOne = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id, {
            include: [
                { model: User, as: "organizer", attributes: ["id", "name", "email"] },
                Category,
                Location,
            ],
        });
        if (!event) return res.status(404).json({ message: "Event not found" });
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        await event.update(req.body);
        res.json({ message: "Event updated" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const result = await Event.destroy({
            where: { id: req.params.id }
        });
        if (!result) return res.status(404).json({ message: "Event not found" });
        res.json({ message: "Event deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
