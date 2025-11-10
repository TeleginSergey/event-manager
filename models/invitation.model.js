module.exports = (sequelize, DataTypes) => {
    const Invitation = sequelize.define("Invitation", {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        status: { type: DataTypes.ENUM('pending', 'accepted', 'declined'), defaultValue: 'pending' },
        EventId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Events',
                key: 'id'
            }
        },
        inviteeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        }
    });
    return Invitation;
};
