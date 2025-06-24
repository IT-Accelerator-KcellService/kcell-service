import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Request = sequelize.define('Request', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    request_id_display: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    request_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            isIn: [['Обычная', 'Экстренная', 'Плановая', 'Сложная']]
        }
    },
    title: { type: DataTypes.STRING(255), allowNull: false },
    description: DataTypes.TEXT,
    client_id: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' } },
    office_id: { type: DataTypes.INTEGER, references: { model: 'offices', key: 'id' } },
    location_detail: DataTypes.STRING(255),
    date_submitted: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            isIn: [['Новая', 'В обработке', 'Исполнение', 'Завершено', 'Ожидает назначения', 'Ожидает SLA', 'Назначена', 'В работе', 'Запланирована']]
        }
    },
    category_id: { type: DataTypes.INTEGER, references: { model: 'service_categories', key: 'id' } },
    complexity: { type: DataTypes.STRING(50) },
    sla: DataTypes.STRING(50),
    executor_id: { type: DataTypes.INTEGER, references: { model: 'executors', key: 'id' } },
    admin_worker_id: { type: DataTypes.INTEGER, references: { model: 'users', key: 'id' } },
    progress: { type: DataTypes.INTEGER, defaultValue: 0 },
    rating: { type: DataTypes.INTEGER, validate: { min: 1, max: 5 } },
    planned_completion_date: DataTypes.DATEONLY,
    actual_completion_date: DataTypes.DATE,
    rejection_reason: DataTypes.TEXT
}, {
    tableName: 'requests',
    timestamps: false
});
