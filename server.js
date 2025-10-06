const express = require("express");
const bodyParser = require("body-parser");
const db = require("./models");

const app = express();
app.use(bodyParser.json());

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
