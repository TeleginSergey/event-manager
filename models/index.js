const dbConfig = require("../config/db.config.js");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user.model.js")(sequelize, DataTypes);
db.Event = require("./event.model.js")(sequelize, DataTypes);
db.Invitation = require("./invitation.model.js")(sequelize, DataTypes);
db.Participation = require("./participation.model.js")(sequelize, DataTypes);
db.Category = require("./category.model.js")(sequelize, DataTypes);
db.Location = require("./location.model.js")(sequelize, DataTypes);
db.Comment = require("./comment.model.js")(sequelize, DataTypes);

db.Event.belongsTo(db.User, { as: "organizer" });
db.User.hasMany(db.Event, { foreignKey: "organizerId" });

db.Event.belongsTo(db.Category);
db.Category.hasMany(db.Event);

db.Event.belongsTo(db.Location);
db.Location.hasMany(db.Event);

db.Invitation.belongsTo(db.User, { as: "invitee" });
db.Invitation.belongsTo(db.Event);
db.User.hasMany(db.Invitation, { foreignKey: "inviteeId" });
db.Event.hasMany(db.Invitation);

db.Participation.belongsTo(db.User);
db.Participation.belongsTo(db.Event);
db.User.hasMany(db.Participation);
db.Event.hasMany(db.Participation);

db.Comment.belongsTo(db.User, { as: "author" });
db.Comment.belongsTo(db.Event);
db.Event.hasMany(db.Comment);
db.User.hasMany(db.Comment, { foreignKey: "authorId" });

module.exports = db;
