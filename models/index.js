const dbConfig = require("../config/db.config.js");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    dialectOptions: dbConfig.dialectOptions,
    pool: dbConfig.pool,
    logging: dbConfig.logging
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

db.Event.belongsTo(db.User, { as: "organizer", foreignKey: "organizerId" });
db.User.hasMany(db.Event, { foreignKey: "organizerId" });

db.Event.belongsTo(db.Category); // uses CategoryId
db.Category.hasMany(db.Event);   // uses CategoryId

db.Event.belongsTo(db.Location); // uses LocationId
db.Location.hasMany(db.Event);   // uses LocationId

db.Invitation.belongsTo(db.User, { as: "invitee", foreignKey: "inviteeId" });
db.Invitation.belongsTo(db.Event, { foreignKey: "EventId" });
db.User.hasMany(db.Invitation, { foreignKey: "inviteeId" });
db.Event.hasMany(db.Invitation, { foreignKey: "EventId" });

db.Participation.belongsTo(db.User);   // uses UserId
db.Participation.belongsTo(db.Event);  // uses EventId
db.User.hasMany(db.Participation);     // uses UserId
db.Event.hasMany(db.Participation);    // uses EventId

db.Comment.belongsTo(db.User, { as: "author", foreignKey: "authorId" });
db.Comment.belongsTo(db.Event, { foreignKey: "EventId" });
db.Event.hasMany(db.Comment, { foreignKey: "EventId" });
db.User.hasMany(db.Comment, { as: "comments", foreignKey: "authorId" });

module.exports = db;
