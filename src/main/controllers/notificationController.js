import NotificationService from "../services/notificationService.js"
import {asyncHandler} from "../middleware/asyncHandler.js";

class NotificationController {
  static getMyNotifications = asyncHandler(async (req, res) => {
      const userId = req.user.id
      const notifications = await NotificationService.getNotificationsByUserId(userId)
      res.json(notifications)
  })

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
