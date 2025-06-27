import { User } from './User.js';
import { Office } from './Office.js';
import { Executor } from './Executor.js';
import { Request } from './Request.js';
import { ServiceCategory } from './ServiceCategory.js';
import { RequestPhoto } from './RequestPhoto.js';
import { RequestComment } from './RequestComment.js';
import {Plan} from "./Plan.js";
import {RequestRating} from "./RequestRating.js";
import {Notification} from "./Notification.js";


// Office ↔ Users
Office.hasMany(User, { foreignKey: 'office_id' });
User.belongsTo(Office, { foreignKey: 'office_id' });

// Executor ↔ User
User.hasOne(Executor, { foreignKey: 'user_id' , as: 'executor' });
Executor.belongsTo(User, { foreignKey: 'user_id' , as: 'user' });

// User (client) ↔ Request
User.hasMany(Request, { foreignKey: 'client_id', as: 'clientRequests' });
Request.belongsTo(User, { foreignKey: 'client_id', as: 'client' });

// User (admin) ↔ Request
User.hasMany(Request, { foreignKey: 'admin_worker_id', as: 'adminRequests' });
Request.belongsTo(User, { foreignKey: 'admin_worker_id', as: 'admin' });

// Executor ↔ Request
Executor.hasMany(Request, { foreignKey: 'executor_id', as: 'requests' });
Request.belongsTo(Executor, { foreignKey: 'executor_id', as: 'executor' });


// Office ↔ Request
Office.hasMany(Request, { foreignKey: 'office_id' });
Request.belongsTo(Office, { foreignKey: 'office_id' });

// ServiceCategory ↔ Request
ServiceCategory.hasMany(Request, { foreignKey: 'category_id', as: 'requests' });
Request.belongsTo(ServiceCategory, { foreignKey: 'category_id', as: 'category' });

// Request ↔ RequestPhoto
Request.hasMany(RequestPhoto, { foreignKey: 'request_id' , as: 'photos' });
RequestPhoto.belongsTo(Request, { foreignKey: 'request_id', as: 'request' });

// Request ↔ RequestComment
Request.hasMany(RequestComment, { foreignKey: 'request_id', as: 'comments' });
RequestComment.belongsTo(Request, { foreignKey: 'request_id', as: 'request' });

// User ↔ RequestComment (sender)
User.hasMany(RequestComment, { foreignKey: 'sender_id', as: 'comments' });
RequestComment.belongsTo(User, { foreignKey: 'sender_id', as: 'user' });

Plan.belongsTo(User, { foreignKey: 'department_id' });
Plan.belongsTo(Office, { foreignKey: 'office_id' });

RequestRating.belongsTo(Request, { foreignKey: 'request_id', unique: true});
Request.hasMany(RequestRating, { foreignKey: 'request_id', as: 'ratings' });
RequestRating.belongsTo(User, { foreignKey: 'rated_by' });

Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });

Notification.belongsTo(Request, { foreignKey: 'request_id', as: 'request' });
Request.hasMany(Notification, { foreignKey: 'request_id', as: 'notifications' });

export {
    User,
    Request,
    ServiceCategory,
    RequestComment,
    Office,
    Executor,
    RequestPhoto,
    Plan,
    RequestRating,
    Notification,
}
