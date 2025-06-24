import { Router } from "express"
import ChatMessageController from "../controllers/chatMessageController.js"
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware.js"

const router = Router()

router.get("/", authenticateToken, ChatMessageController.getAllChatMessages)
router.get("/:id", authenticateToken, ChatMessageController.getChatMessageById)
router.post(
  "/",
  authenticateToken,
  authorizeRoles("client", "admin-worker", "executor", "manager"),
  ChatMessageController.createChatMessage,
)
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin-worker", "manager"),
  ChatMessageController.updateChatMessage,
)
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin-worker", "manager"),
  ChatMessageController.deleteChatMessage,
)
router.get("/request/:requestId", authenticateToken, ChatMessageController.getMessagesByRequestId)

export default router
