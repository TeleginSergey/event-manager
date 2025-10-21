const db = require("../models");
const Comment = db.Comment;
const User = db.User;

exports.create = async (req, res) => {
    try {
        const comment = await Comment.create({
            content: req.body.content,
            EventId: req.body.eventId,
            UserId: req.user.id // Используем ID аутентифицированного пользователя
        });
        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findByEvent = async (req, res) => {
    try {
        const comments = await Comment.findAll({
            where: { EventId: req.params.eventId },
            include: [
                { model: User, attributes: ['id', 'name', 'email'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
