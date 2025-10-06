const db = require("../models");
const Comment = db.Comment;

exports.create = async (req, res) => {
    try {
        const comment = await Comment.create(req.body);
        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.findByEvent = async (req, res) => {
    try {
        const comments = await Comment.findAll({
            where: { EventId: req.params.eventId }
        });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
