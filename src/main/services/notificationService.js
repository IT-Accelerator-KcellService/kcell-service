import sgMail from '@sendgrid/mail';
import {Notification, User} from "../models//init.js"
import {ForbiddenError, NotFoundError} from "../errors/errors.js";
import req from "express/lib/request.js";
import {user} from "pg/lib/defaults.js";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

    static async sendNotification({ userId, requestId = null, type, content = null }) {
        if (!userId || !type) {
            throw new Error("Missing required fields: userId or type");
        }
        const sender = await User.findByPk(userId);
        switch (type) {
            case 'new_request':
                if (!sender || !sender.office_id) {
                    throw new Error("Sender or office ID not found");
                }

                const admins = await User.findAll({
                    where: {
                        role: 'admin-worker',
                        office_id: sender.office_id
                    }
                });

                for (const admin of admins) {
                    const notifTitle = "Новая заявка";
                    const notifContent = `Пользователь из вашего офиса создал новую заявку(${requestId}).`;

                    Notification.create({
                        user_id: admin.id,
                        request_id: requestId,
                        title: notifTitle,
                        content: notifContent,
                        is_read: false
                    });

                    sgMail.send({
                        to: admin.email,
                        from: process.env.SENDGRID_EMAIL_FROM,
                        subject: notifTitle,
                        text: notifContent
                    });
                }

                break;
            case 'reject_request':
                const notifTitle = "Заявка откланен";

                await Notification.create({
                    user_id: userId,
                    request_id: requestId,
                    title: notifTitle,
                    content: content,
                    is_read: false
                });

                await sgMail.send({
                    to: sender.email,
                    from: process.env.SENDGRID_EMAIL_FROM,
                    subject: notifTitle,
                    text: content
                });
                break;
            case 'awaiting_assignment':

                break;
            default:
                throw new Error(`Unknown notification type: ${type}`);
        }
    }
}

export default NotificationService