// models/Executor.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Executor = sequelize.define('Executor', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    specialty: { type: DataTypes.STRING(100), allowNull: false },
    rating: { type: DataTypes.DECIMAL(2, 1), defaultValue: 0.0 },
    workload: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
    tableName: 'executors',
    timestamps: false
});
