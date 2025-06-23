// backend/routes/officeRoutes.js
import { Router } from "express"
import OfficeController from "../controllers/officeController.js"
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware.js"

const router = Router()

router.get("/", authenticateToken, OfficeController.getAllOffices)
router.get("/:id", authenticateToken, OfficeController.getOfficeById)
router.post("/", authenticateToken, authorizeRoles("admin-worker", "manager"), OfficeController.createOffice)
router.put("/:id", authenticateToken, authorizeRoles("admin-worker", "manager"), OfficeController.updateOffice)
router.delete("/:id", authenticateToken, authorizeRoles("admin-worker", "manager"), OfficeController.deleteOffice)

export default router
