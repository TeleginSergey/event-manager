const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}


function logSecurityEvent(level, message, metadata = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        level,
        message,
        metadata: {
            ...metadata,
            ip: metadata.ip || 'unknown',
            userAgent: metadata.userAgent || 'unknown'
        }
    };
    
    const logFile = path.join(logDir, `security-${new Date().toISOString().split('T')[0]}.log`);
    const logLine = JSON.stringify(logEntry) + '\n';
    
    fs.appendFile(logFile, logLine, (err) => {
        if (err) {
            console.error('Ошибка записи в лог безопасности:', err);
        }
    });

    console.log(`[SECURITY ${level.toUpperCase()}] ${message}`, metadata);
}

const logAuthAttempts = (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
        const statusCode = res.statusCode;
        const isSuccess = statusCode >= 200 && statusCode < 300;
        
        if (req.path.includes('/login') || req.path.includes('/register')) {
            logSecurityEvent(
                isSuccess ? 'info' : 'warn',
                isSuccess ? 'Успешная аутентификация' : 'Неудачная попытка аутентификации',
                {
                    ip: req.ip || req.connection.remoteAddress,
                    userAgent: req.get('User-Agent'),
                    path: req.path,
                    method: req.method,
                    statusCode,
                    email: req.body?.email
                }
            );
        }
        
        originalSend.call(this, data);
    };
    
    next();
};


const logSuspiciousActivity = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    const suspiciousPatterns = [
        /script/i,
        /<script/i,
        /javascript:/i,
        /onload=/i,
        /onerror=/i,
        /union.*select/i,
        /drop.*table/i,
        /insert.*into/i,
        /delete.*from/i
    ];
    
    const checkSuspicious = (obj, path = '') => {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                const value = obj[key];
                const fullPath = path ? `${path}.${key}` : key;
                
                for (const pattern of suspiciousPatterns) {
                    if (pattern.test(value)) {
                        logSecurityEvent('warn', 'Обнаружена подозрительная активность', {
                            ip,
                            userAgent,
                            path: req.path,
                            method: req.method,
                            suspiciousField: fullPath,
                            suspiciousValue: value,
                            pattern: pattern.toString()
                        });
                        break;
                    }
                }
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                checkSuspicious(obj[key], path ? `${path}.${key}` : key);
            }
        }
    };
    
    // Проверяем body, query и params
    if (req.body) checkSuspicious(req.body, 'body');
    if (req.query) checkSuspicious(req.query, 'query');
    if (req.params) checkSuspicious(req.params, 'params');
    
    next();
};

/**
 * Middleware для логирования ошибок
 */
const logErrors = (err, req, res, next) => {
    logSecurityEvent('error', 'Ошибка сервера', {
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method,
        error: err.message,
        stack: err.stack
    });
    
    next(err);
};

/**
 * Middleware для логирования доступа к защищенным ресурсам
 */
const logAccess = (req, res, next) => {
    if (req.user) {
        logSecurityEvent('info', 'Доступ к защищенному ресурсу', {
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            path: req.path,
            method: req.method,
            userId: req.user.id,
            userEmail: req.user.email
        });
    }
    
    next();
};

module.exports = {
    logSecurityEvent,
    logAuthAttempts,
    logSuspiciousActivity,
    logErrors,
    logAccess
};
