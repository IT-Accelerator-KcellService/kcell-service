import sgMail from '@sendgrid/mail';
import {Notification, User} from "../models//init.js"
import {ForbiddenError, NotFoundError} from "../errors/errors.js";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class NotificationService {
    static async getNotificationsByUserId(userId, page = 1, pageSize = 10) {
        const offset = (page - 1) * pageSize;

        const { count, rows } = await Notification.findAndCountAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']],
            limit: pageSize,
            offset: offset,
        });

        return {
            notifications: rows,
            page,
            pageSize,
            total: count,
            totalPages: Math.ceil(count / pageSize),
        };
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
    static async sendPasswordNotification({ userId, rawPassword }) {
        const user = await User.findByPk(userId);

        if (!user) {
            throw new NotFoundError('User not found');
        }

        const title = 'Добро пожаловать!';
        const content = `Ваш аккаунт был создан. Ваш пароль: ${rawPassword}`;

        // Сохраняем уведомление в БД
        await Notification.create({
            user_id: user.id,
            title,
            content,
            is_read: false
        });

        // Отправляем email через SendGrid
        await sgMail.send({
            to: user.email,
            from: process.env.SENDGRID_EMAIL_FROM,
            subject: title,
            text: content
        });
    }

    static async sendNotification({ userId, requestId, type, content = null }) {
        try {
            if (!userId || !type) {
                throw new Error("Missing required fields: userId or type");
            }
            const sender = await User.findByPk(userId);
            let notifTitle;
            let notifContent;
            let admins;
            let department_heads;
            switch (type) {
                case 'new_request':
                    if (!sender || !sender.office_id) {
                        throw new Error("Sender or office ID not found");
                    }

                    admins = await User.findAll({
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
                    department_heads = await User.findAll({
                        where: {
                            role: 'department-head'
                        }
                    });
                    notifTitle = "Админ принял заявку";
                    for (const depHead of department_heads) {
                        Notification.create({
                            user_id: depHead.id,
                            request_id: requestId,
                            title: notifTitle,
                            content: content,
                            is_read: false
                        });

                        sgMail.send({
                            to: depHead.email,
                            from: process.env.SENDGRID_EMAIL_FROM,
                            subject: notifTitle,
                            text: content
                        });
                    }

                    Notification.create({
                        user_id: sender.id,
                        request_id: requestId,
                        title: notifTitle,
                        content: content,
                        is_read: false
                    });

                    sgMail.send({
                        to: sender.email,
                        from: process.env.SENDGRID_EMAIL_FROM,
                        subject: notifTitle,
                        text: content
                    });

                    break;
                case 'assigned':
                    notifTitle = "Вам назначили новую заявку!"
                    Notification.create({
                        user_id: sender.id,
                        request_id: requestId,
                        title: notifTitle,
                        content: content,
                        is_read: false
                    });
                    sgMail.send({
                        to: sender.email,
                        from: process.env.SENDGRID_EMAIL_FROM,
                        subject: notifTitle,
                        text: content
                    });

                    break;
                case 'start_request':
                    notifTitle = "Исполнитель начал исполнять заявку"

                    admins = await User.findAll({
                        where: {
                            role: 'admin-worker',
                            office_id: sender.office_id
                        }
                    });
                    for (const admin of admins) {
                        Notification.create({
                            user_id: admin.id,
                            request_id: requestId,
                            title: notifTitle,
                            content: content,
                            is_read: false
                        });

                        sgMail.send({
                            to: admin.email,
                            from: process.env.SENDGRID_EMAIL_FROM,
                            subject: notifTitle,
                            text: content
                        });
                    }
                    Notification.create({
                        user_id: sender.id,
                        request_id: requestId,
                        title: notifTitle,
                        content: content,
                        is_read: false
                    });
                    sgMail.send({
                        to: sender.email,
                        from: process.env.SENDGRID_EMAIL_FROM,
                        subject: notifTitle,
                        text: content
                    });

                    break;
                case 'end_request':
                    notifTitle = "Исполнитель закончил исполнять заявку"

                    admins = await User.findAll({
                        where: {
                            role: 'admin-worker',
                            office_id: sender.office_id
                        }
                    });
                    for (const admin of admins) {
                        Notification.create({
                            user_id: admin.id,
                            request_id: requestId,
                            title: notifTitle,
                            content: content,
                            is_read: false
                        });

                        sgMail.send({
                            to: admin.email,
                            from: process.env.SENDGRID_EMAIL_FROM,
                            subject: notifTitle,
                            text: content
                        });
                    }
                    Notification.create({
                        user_id: sender.id,
                        request_id: requestId,
                        title: notifTitle,
                        content: content,
                        is_read: false
                    });
                    sgMail.send({
                        to: sender.email,
                        from: process.env.SENDGRID_EMAIL_FROM,
                        subject: notifTitle,
                        text: content
                    });

                    break;
                default:
                    throw new Error(`Unknown notification type: ${type}`);
            }
        } catch (error) {
            console.error(error);
        }
    }

    static async sendNotificationToManagers(title, content) {
        const managers = await User.findAll({
            where: {
                role: 'manager'
            }
        });
        for (const manager of managers) {
            Notification.create({
                user_id: manager.id,
                title: title,
                content: content,
                is_read: false
            });
        }
    }
}

export default NotificationService