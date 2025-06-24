import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
export const RequestRating = sequelize.define('RequestRating', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 0, max: 5 }
    },
    rated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'request_ratings', timestamps: false });
