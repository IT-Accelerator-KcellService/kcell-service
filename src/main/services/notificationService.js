import sgMail from '@sendgrid/mail';
import {Notification, User} from "../models//init.js"
import {ForbiddenError, NotFoundError} from "../errors/errors.js";

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

    static async sendNotification({ userId, requestId, type, content = null }) {
        if (!userId || !type) {
            throw new Error("Missing required fields: userId or type");
        }
        const sender = await User.findByPk(userId);
        let notifTitle;
        let notifContent;
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
                notifTitle = "Новая заявка";
                notifContent = `Пользователь из вашего офиса создал новую заявку(${requestId}).`;
                for (const admin of admins) {
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
                notifTitle = "Заявка откланен";

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
                const department_heads = await User.findAll({
                    where: {
                        role: 'department-head'
                    }
                });
                notifTitle = "Админ принял заявку";
                notifContent = `Админ принял заявку(${requestId}).`;
                for (const depHead of department_heads) {
                    Notification.create({
                        user_id: depHead.id,
                        request_id: requestId,
                        title: notifTitle,
                        content: notifContent,
                        is_read: false
                    });

                    sgMail.send({
                        to: depHead.email,
                        from: process.env.SENDGRID_EMAIL_FROM,
                        subject: notifTitle,
                        text: notifContent
                    });
                }

                Notification.create({
                    user_id: sender.id,
                    request_id: requestId,
                    title: notifTitle,
                    content: notifContent,
                    is_read: false
                });

                sgMail.send({
                    to: sender.email,
                    from: process.env.SENDGRID_EMAIL_FROM,
                    subject: notifTitle,
                    text: notifContent
                });
                break;
            default:
                throw new Error(`Unknown notification type: ${type}`);
        }
    }
}

export default NotificationService