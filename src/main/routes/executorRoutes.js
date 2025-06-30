import { Router } from "express"
import ExecutorController from "../controllers/executorController.js"
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware.js"

const router = Router()

router.get(
  "/",
  authenticateToken,
  authorizeRoles("department-head"),
  ExecutorController.getAllExecutors,
)
router.get('/average-rating',authenticateToken, ExecutorController.getAverageRating)
router.get("/:id", authenticateToken, ExecutorController.getExecutorById)
router.post("/", authenticateToken, authorizeRoles("admin-worker", "manager"), ExecutorController.createExecutor)
router.put("/:id", authenticateToken, authorizeRoles("admin-worker", "manager"), ExecutorController.updateExecutor)
router.delete("/:id", authenticateToken, authorizeRoles("admin-worker", "manager"), ExecutorController.deleteExecutor)
export default router
