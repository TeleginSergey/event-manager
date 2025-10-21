const db = require("../models");
const User = db.User;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Находим пользователя по email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }
        
        // Проверяем, не заблокирован ли аккаунт
        if (user.isLocked()) {
            return res.status(423).json({ 
                error: 'Аккаунт заблокирован из-за множественных неудачных попыток входа' 
            });
        }
        
        // Проверяем, активен ли пользователь
        if (!user.isActive) {
            return res.status(401).json({ error: 'Аккаунт деактивирован' });
        }
        
        // Проверяем пароль
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            // Увеличиваем счетчик неудачных попыток
            await user.incLoginAttempts();
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }
        
        // Сбрасываем счетчик попыток при успешном входе
        await user.resetLoginAttempts();
        
        // Создаем JWT токен
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );
        
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            token
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        // Проверяем, существует ли пользователь с таким email
        const existingUser = await User.findOne({ where: { email: req.body.email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
        }

        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });
        
        // Создаем JWT токен
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );
        
        res.status(201).json({ 
            id: user.id, 
            name: user.name, 
            email: user.email,
            token 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.findAll = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.findOne = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 8);
        }

        await user.update(req.body);
        res.json({ message: "User updated" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ error: "Пользователь не найден" });

        // Если обновляется пароль, хешируем его
        if (req.body.password) {
            const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
            req.body.password = await bcrypt.hash(req.body.password, saltRounds);
        }

        await user.update(req.body);
        res.json({ message: "Профиль обновлен" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const result = await User.destroy({
            where: { id: req.params.id }
        });
        if (!result) return res.status(404).json({ error: "Пользователь не найден" });
        res.json({ message: "Пользователь удален" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
