import {Notification} from "../models//init.js"
import {ForbiddenError, NotFoundError} from "../errors/errors.js";

class NotificationService {
    static async getNotificationsByUserId(userId) {
        return await Notification.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']]
        })
    }

    static async markAsRead(id, userId) {
        const notification = await Notification.findByPk(id)
        if (!notification) {
            throw new NotFoundError("Notification not found")
        }
        if (notification.user_id !== userId) {
            throw new ForbiddenError("Forbidden")
        }
        notification.is_read = true
        await notification.save()
        return notification
    }

    static async deleteNotification(id, userId) {
        const notification = await Notification.findByPk(id)
        if (!notification) {
            throw new NotFoundError("Notification not found")
        }
        if (notification.user_id !== userId) {
            throw new ForbiddenError("Forbidden")
        }
        return await Notification.destroy({where: {id}})
    }
}

export default NotificationService