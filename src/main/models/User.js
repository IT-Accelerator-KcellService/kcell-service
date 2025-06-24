import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    full_name: { type: DataTypes.STRING(255), allowNull: false },
    office_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'offices',
            key: 'id'
        }
    },
    role: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            isIn: [['client', 'admin-worker', 'department-head', 'executor', 'manager']]
        }
    }
}, {
    tableName: 'users',
    timestamps: false
});
