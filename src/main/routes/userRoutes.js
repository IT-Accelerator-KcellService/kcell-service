import { Router } from "express"
import UserController from "../controllers/userController.js"
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware.js"
import {validateBody} from "../middleware/validate.js";
import {UpdateUserDto, UserDto} from "../dto/User.dto.js";

const router = Router()

router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin-worker", "department-head", "manager"),
  UserController.getAllUsers,
)
router.get("/me", authenticateToken, UserController.getUserById)
router.post(
    "/",
    authenticateToken,
    authorizeRoles("admin-worker", "manager", "department-head"),
    validateBody(UserDto),
    UserController.createUser
)
router.put("/:id", authenticateToken, validateBody(UpdateUserDto), UserController.updateUser)
router.delete("/:id", authenticateToken, authorizeRoles("admin-worker", "manager"), UserController.deleteUser)

export default router
