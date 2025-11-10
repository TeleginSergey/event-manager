require('dotenv').config();
const { app, initializeDatabase } = require("./app");

initializeDatabase().catch((err) => {
    console.error("❌ Failed to initialize database:", err.message);
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on port ${PORT}`);
    console.log(`Listening on all interfaces (0.0.0.0:${PORT})`);
});

server.on('error', (err) => {
    console.error(`[SERVER ERROR]`, err);
});

module.exports = server;
