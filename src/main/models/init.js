import { User } from './User.js';
import { Office } from './Office.js';
import { Executor } from './Executor.js';
import { Request } from './Request.js';
import { ServiceCategory } from './ServiceCategory.js';
import { RequestPhoto } from './RequestPhoto.js';
import { ChatMessage } from './ChatMessage.js';


// Office ↔ Users
Office.hasMany(User, { foreignKey: 'office_id' });
User.belongsTo(Office, { foreignKey: 'office_id' });

// Executor ↔ User
User.hasOne(Executor, { foreignKey: 'user_id' });
Executor.belongsTo(User, { foreignKey: 'user_id' });

// User (client) ↔ Request
User.hasMany(Request, { foreignKey: 'client_id', as: 'clientRequests' });
Request.belongsTo(User, { foreignKey: 'client_id', as: 'client' });

// User (admin) ↔ Request
User.hasMany(Request, { foreignKey: 'admin_worker_id', as: 'adminRequests' });
Request.belongsTo(User, { foreignKey: 'admin_worker_id', as: 'admin' });

// Executor ↔ Request
Executor.hasMany(Request, { foreignKey: 'executor_id' });
Request.belongsTo(Executor, { foreignKey: 'executor_id' });

// Office ↔ Request
Office.hasMany(Request, { foreignKey: 'office_id' });
Request.belongsTo(Office, { foreignKey: 'office_id' });

// ServiceCategory ↔ Request
ServiceCategory.hasMany(Request, { foreignKey: 'category_id' });
Request.belongsTo(ServiceCategory, { foreignKey: 'category_id' });

// Request ↔ RequestPhoto
Request.hasMany(RequestPhoto, { foreignKey: 'request_id' });
RequestPhoto.belongsTo(Request, { foreignKey: 'request_id' });

// Request ↔ ChatMessage
Request.hasMany(ChatMessage, { foreignKey: 'request_id' });
ChatMessage.belongsTo(Request, { foreignKey: 'request_id' });

// User ↔ ChatMessage (sender)
User.hasMany(ChatMessage, { foreignKey: 'sender_id' });
ChatMessage.belongsTo(User, { foreignKey: 'sender_id' });
export {
    User,
    Request,
    ServiceCategory,
    ChatMessage,
    Office,
    Executor,
    RequestPhoto
}
