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
router.get("/", authenticateToken, RequestController.getAllRequests)
router.get("/user", authenticateToken, RequestController.getRequestsByUser)

router.get("/:id", authenticateToken, RequestController.getRequestById)
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin-worker", "executor", "manager"),
  RequestController.updateRequest,
)
router.delete("/:id", authenticateToken, authorizeRoles("admin-worker", "manager"), RequestController.deleteRequest)

router.get("/admin-worker/me", authenticateToken, authorizeRoles("admin-worker"), RequestController.getAdminWorkerRequests)

export default router
