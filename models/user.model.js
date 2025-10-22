module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        id: { 
            type: DataTypes.INTEGER, 
            autoIncrement: true, 
            primaryKey: true 
        },
        name: { 
            type: DataTypes.STRING, 
            allowNull: false,
            validate: {
                len: [2, 50],
                notEmpty: true
            }
        },
        email: { 
            type: DataTypes.STRING, 
            allowNull: false, 
            unique: true,
            validate: {
                isEmail: true,
                notEmpty: true
            }
        },
        password: { 
            type: DataTypes.STRING, 
            allowNull: false,
            validate: {
                len: [8, 255],
                notEmpty: true
            }
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        lastLogin: {
            type: DataTypes.DATE,
            allowNull: true
        },
        loginAttempts: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        lockedUntil: {
            type: DataTypes.DATE,
            allowNull: true
        },
        emailVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        emailVerificationToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        passwordResetToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        passwordResetExpires: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        timestamps: true,
        paranoid: true,
        indexes: [
            {
                unique: true,
                fields: ['email']
            },
            {
                fields: ['isActive']
            }
        ]
    });


    User.prototype.isLocked = function() {
        return !!(this.lockedUntil && this.lockedUntil > Date.now());
    };


    User.prototype.incLoginAttempts = function() {
        if (this.lockedUntil && this.lockedUntil < Date.now()) {
            return this.update({
                loginAttempts: 1,
                lockedUntil: null
            });
        }
        
        const updates = { loginAttempts: this.loginAttempts + 1 };
        
        if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
            updates.lockedUntil = Date.now() + 2 * 60 * 60 * 1000;
        }
        
        return this.update(updates);
    };

    User.prototype.resetLoginAttempts = function() {
        return this.update({
            loginAttempts: 0,
            lockedUntil: null,
            lastLogin: new Date()
        });
    };

    return User;
};
