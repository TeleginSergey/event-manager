const db = require("../models");
const Location = db.Location;

exports.create = async (req, res) => {
    try {
        const location = await Location.create({
            name: req.body.name,
            address: req.body.address
        });
        res.status(201).json(location);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.findAll = async (req, res) => {
    try {
        const locations = await Location.findAll();
        res.json(locations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
