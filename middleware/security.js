const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const xss = require('xss');


const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = process.env.ALLOWED_ORIGINS ? 
            process.env.ALLOWED_ORIGINS.split(',') : 
            ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:8080'];
        
        // Allow requests with no origin (like curl, Postman, mobile apps, same-origin)
        if (!origin) {
            return callback(null, true);
        }
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};


const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: {
        error: 'Слишком много запросов с этого IP, попробуйте позже.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});


const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        error: 'Слишком много попыток входа, попробуйте позже.'
    },
    skipSuccessfulRequests: true,
});


const helmetOptions = {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
        },
    },
    crossOriginEmbedderPolicy: false
};


const xssClean = (req, res, next) => {
    if (req.body) {
        for (let key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = xss(req.body[key]);
            }
        }
    }
    if (req.query) {
        for (let key in req.query) {
            if (typeof req.query[key] === 'string') {
                req.query[key] = xss(req.query[key]);
            }
        }
    }
    if (req.params) {
        for (let key in req.params) {
            if (typeof req.params[key] === 'string') {
                req.params[key] = xss(req.params[key]);
            }
        }
    }
    next();
};

module.exports = {
    cors: cors(corsOptions),
    limiter,
    authLimiter,
    helmet: helmet(helmetOptions),
    xssClean
};
