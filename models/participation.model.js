module.exports = (sequelize, DataTypes) => {
    const Participation = sequelize.define("Participation", {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }
    });
    return Participation;
};
