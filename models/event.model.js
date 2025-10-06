module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define("Event", {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        title: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT },
        date: { type: DataTypes.DATE, allowNull: false }
    });
    return Event;
};
