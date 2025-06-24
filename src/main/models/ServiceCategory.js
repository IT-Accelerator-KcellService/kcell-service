// models/ServiceCategory.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const ServiceCategory = sequelize.define('ServiceCategory', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false, unique: true }
}, {
    tableName: 'service_categories',
    timestamps: false
});
