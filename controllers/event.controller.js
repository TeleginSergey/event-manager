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
            organizerId: req.user.id,
            CategoryId: req.body.categoryId,
            LocationId: req.body.locationId,
        });
        res.status(201).json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { count, rows: events } = await Event.findAndCountAll({
            include: [
                { model: User, as: "organizer", attributes: ["id", "name", "email"] },
                Category,
                Location,
            ],
            order: [['date', 'ASC']],
            limit,
            offset,
        });

        res.json({
            events,
            pagination: {
                total: count,
                page,
                pages: Math.ceil(count / limit),
                limit
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
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
        if (!event) return res.status(404).json({ error: "Событие не найдено" });
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {

        const event = req.resource;
        
        await event.update(req.body);
        res.json({ message: "Событие обновлено" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const event = req.resource;
        
        await event.destroy();
        res.json({ message: "Событие удалено" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
