module.exports = (sequelize, DataTypes) => {
    const Location = sequelize.define("Location", {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        address: { type: DataTypes.STRING }
    });
    return Location;
};
