import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Request = sequelize.define('Request', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    request_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            isIn: [['normal', 'urgent', 'planned']]
        }
    },
    title: { type: DataTypes.STRING(255), allowNull: false },
    description: DataTypes.TEXT,
    client_id: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' } },
    office_id: { type: DataTypes.INTEGER, references: { model: 'offices', key: 'id' } },
    plan_id: { type: DataTypes.INTEGER, references: { model: 'plans', key: 'id' } },
    location: { type: DataTypes.STRING(255), allowNull: false },
    location_detail: DataTypes.STRING(255),
    date_submitted: { type: DataTypes.DATE },
    status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            isIn: [['in_progress', 'execution', 'completed', 'rejected',
                'awaiting_assignment', 'awaiting_sla', 'assigned']]
        },
        defaultValue: 'in_progress'
    },
    category_id: { type: DataTypes.INTEGER, references: { model: 'service_categories', key: 'id' } },
    complexity: { type: DataTypes.STRING(50) },
    sla: DataTypes.STRING(50),
    executor_id: { type: DataTypes.INTEGER, references: { model: 'executors', key: 'id' } },
    actual_completion_date: DataTypes.DATE,
    rejection_reason: DataTypes.TEXT,
    planned_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    created_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    comment: { type: DataTypes.STRING(255), allowNull: true },

}, {
    tableName: 'requests',
    timestamps: false
});
