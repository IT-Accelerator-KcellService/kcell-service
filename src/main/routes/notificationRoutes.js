import { Router } from "express"
import NotificationController from "../controllers/notificationController.js"
import { authenticateToken } from "../middleware/authMiddleware.js"

const router = Router()

router.get("/me", authenticateToken, NotificationController.getMyNotifications)
router.patch("/:id/read", authenticateToken, NotificationController.markAsRead)
router.delete("/:id", authenticateToken, NotificationController.deleteNotification)

export default router
