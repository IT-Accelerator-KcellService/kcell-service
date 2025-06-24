import { Router } from "express"
import RequestController from "../controllers/requestController.js"
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware.js"

const router = Router()

router.post(
  "/",
  authenticateToken,
  authorizeRoles("client", "admin-worker", "manager"),
  RequestController.createRequest,
)
router.get("/", authenticateToken, RequestController.getAllRequests) // Доступно всем аутентифицированным
router.get("/:id", authenticateToken, RequestController.getRequestById)
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin-worker", "executor", "manager"),
  RequestController.updateRequest,
)
router.delete("/:id", authenticateToken, authorizeRoles("admin-worker", "manager"), RequestController.deleteRequest)

export default router
