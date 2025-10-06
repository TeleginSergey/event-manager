module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define("Comment", {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        content: { type: DataTypes.TEXT, allowNull: false }
    });
    return Comment;
};
