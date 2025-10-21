const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;

// Middleware для проверки JWT токена
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ 
            error: 'Токен доступа не предоставлен' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        const user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password'] }
        });
        
        if (!user) {
            return res.status(401).json({ 
                error: 'Пользователь не найден' 
            });
        }
        
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: 'Токен истек' 
            });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                error: 'Недействительный токен' 
            });
        }
        return res.status(500).json({ 
            error: 'Ошибка при проверке токена' 
        });
    }
};

// Middleware для проверки ролей
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                error: 'Требуется аутентификация' 
            });
        }
        
        // Пока у нас нет ролей, но нашел в инете проверку 
        // if (!roles.includes(req.user.role)) {
        //     return res.status(403).json({ 
        //         error: 'Недостаточно прав доступа' 
        //     });
        // }
        
        next();
    };
};

// Middleware для проверки владельца ресурса
const requireOwnership = (resourceModel, resourceIdParam = 'id') => {
    return async (req, res, next) => {
        try {
            const resourceId = req.params[resourceIdParam];
            const resource = await resourceModel.findByPk(resourceId);
            
            if (!resource) {
                return res.status(404).json({ 
                    error: 'Ресурс не найден' 
                });
            }
            
            // Проверяем, что пользователь является владельцем ресурса
            // Для событий проверяем organizerId, для других ресурсов - userId
            const ownerField = resource.organizerId ? 'organizerId' : 'userId';
            if (resource[ownerField] && resource[ownerField] !== req.user.id) {
                return res.status(403).json({ 
                    error: 'Нет прав доступа к этому ресурсу' 
                });
            }
            
            req.resource = resource;
            next();
        } catch (error) {
            return res.status(500).json({ 
                error: 'Ошибка при проверке прав доступа' 
            });
        }
    };
};

module.exports = {
    authenticateToken,
    requireRole,
    requireOwnership
};
