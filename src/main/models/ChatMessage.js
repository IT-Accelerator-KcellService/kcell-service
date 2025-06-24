// models/ChatMessage.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const ChatMessage = sequelize.define('ChatMessage', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    request_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'requests', key: 'id' }
    },
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    },
    message_text: { type: DataTypes.TEXT, allowNull: false },
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    tableName: 'chat_messages',
    timestamps: false
});
