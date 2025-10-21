require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./models");
const { cors, limiter, helmet, xssClean } = require("./middleware/security");
const { 
    logAuthAttempts, 
    logSuspiciousActivity, 
    logErrors, 
    logAccess 
} = require("./middleware/security-logger");

const app = express();

// Базовые middleware безопасности
app.use(helmet);
app.use(cors);
app.use(limiter);
app.use(xssClean);

// Middleware для логирования безопасности
app.use(logAuthAttempts);
app.use(logSuspiciousActivity);
app.use(logAccess);

// Парсинг JSON с ограничением размера
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

db.sequelize.sync().then(() => {
    console.log("Database synced");
});

app.use("/api/users", require("./routes/user.routes"));
app.use("/api/events", require("./routes/event.routes"));
app.use("/api/invitations", require("./routes/invitation.routes"));
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/locations", require("./routes/location.routes"));
app.use("/api/comments", require("./routes/comment.routes"));

app.get("/", (req, res) => res.send("Event manager API"));

// Обработчик ошибок
app.use(logErrors);

// Обработчик 404
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

// Обработчик глобальных ошибок
app.use((err, req, res, next) => {
    console.error('Глобальная ошибка:', err);
    res.status(500).json({ 
        error: process.env.NODE_ENV === 'production' 
            ? 'Внутренняя ошибка сервера' 
            : err.message 
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
