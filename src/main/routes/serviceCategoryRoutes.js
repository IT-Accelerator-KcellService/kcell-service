// backend/routes/serviceCategoryRoutes.js
import { Router } from "express"
import ServiceCategoryController from "../controllers/serviceCategoryController.js"
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware.js"

const router = Router()

router.get("/", authenticateToken, ServiceCategoryController.getAllServiceCategories)
router.get("/:id", authenticateToken, ServiceCategoryController.getServiceCategoryById)
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin-worker", "manager"),
  ServiceCategoryController.createServiceCategory,
)
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin-worker", "manager"),
  ServiceCategoryController.updateServiceCategory,
)
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin-worker", "manager"),
  ServiceCategoryController.deleteServiceCategory,
)

export default router
