import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const RequestPhoto = sequelize.define('RequestPhoto', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    request_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'requests',
            key: 'id'
        }
    },
    photo_url: { type: DataTypes.STRING(255), allowNull: false },
    type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            isIn: [['before', 'after']]
        }
    }
}, {
    tableName: 'request_photos',
    timestamps: false
});
