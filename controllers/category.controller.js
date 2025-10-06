const db = require("../models");
const Category = db.Category;

exports.create = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.findAll = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
