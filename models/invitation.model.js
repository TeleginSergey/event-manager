module.exports = (sequelize, DataTypes) => {
    const Invitation = sequelize.define("Invitation", {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        status: { type: DataTypes.ENUM('pending', 'accepted', 'declined'), defaultValue: 'pending' }
    });
    return Invitation;
};
