module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define("Event", {
        id: { 
            type: DataTypes.INTEGER, 
            autoIncrement: true, 
            primaryKey: true 
        },
        title: { 
            type: DataTypes.STRING, 
            allowNull: false,
            validate: {
                len: [3, 100],
                notEmpty: true
            }
        },
        description: { 
            type: DataTypes.TEXT,
            validate: {
                len: [0, 1000]
            }
        },
        date: { 
            type: DataTypes.DATE, 
            allowNull: false,
            validate: {
                isDate: true
            }
        },
        organizerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        }
    }, {
        timestamps: true,
        indexes: [
            {
                fields: ['organizerId']
            },
            {
                fields: ['date']
            }
        ]
    });
    return Event;
};
