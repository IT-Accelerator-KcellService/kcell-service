import { Router } from "express"
import ServiceCategoryController from "../controllers/serviceCategoryController.js"
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware.js"
import {validateBody} from "../middleware/validate.js";
import {ServiceCategoryDto} from "../dto/ServiceCategory.dto.js";

const router = Router()

router.get("/", authenticateToken, ServiceCategoryController.getAllServiceCategories)
router.get("/:id", authenticateToken, ServiceCategoryController.getServiceCategoryById)
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin-worker", "manager","department-head"),
  validateBody(ServiceCategoryDto),
  ServiceCategoryController.createServiceCategory,
)
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin-worker", "manager","department-head"),
  validateBody(ServiceCategoryDto),
  ServiceCategoryController.updateServiceCategory,
)
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin-worker", "manager","department-head"),
  ServiceCategoryController.deleteServiceCategory,
)

export default router
