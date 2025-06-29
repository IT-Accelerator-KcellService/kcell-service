import NotificationService from "../services/notificationService.js"
import {asyncHandler} from "../middleware/asyncHandler.js";

class NotificationController {
    static getMyNotifications = asyncHandler(async (req, res) => {
        const userId = req.user.id;

        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        const notifications = await NotificationService.getNotificationsByUserId(
            userId,
            page,
            pageSize
        );

        res.json(notifications);
    });

  static markAsRead = asyncHandler(async (req, res) => {
      const id = req.params.id
      const userId = req.user.id
      const notification = await NotificationService.markAsRead(id, userId)
      res.json(notification)
  })

  static deleteNotification = asyncHandler(async (req, res) => {
      const id = req.params.id
      const userId = req.user.id
      await NotificationService.deleteNotification(id, userId)
      res.status(204).send()
  })
}

export default NotificationController
