// backend/routes/userRoutes.js
import { Router } from "express"
import UserController from "../controllers/userController.js"
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware.js"

const router = Router()

router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin-worker", "department-head", "manager"),
  UserController.getAllUsers,
)
router.get("/:id", authenticateToken, UserController.getUserById)
// Регистрация пользователя будет через /auth/register, здесь только для админов
router.post("/", authenticateToken, authorizeRoles("admin-worker", "manager"), UserController.createUser)
router.put("/:id", authenticateToken, UserController.updateUser) // Пользователь может обновить свой профиль
router.delete("/:id", authenticateToken, authorizeRoles("admin-worker", "manager"), UserController.deleteUser)

export default router
