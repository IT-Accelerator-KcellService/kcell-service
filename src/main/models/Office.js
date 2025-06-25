import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Office = sequelize.define('Office', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    city: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'offices',
    timestamps: false
});
