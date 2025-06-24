import { Router } from "express"
import OfficeController from "../controllers/officeController.js"
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware.js"
import {validateBody} from "../middleware/validate.js";
import {OfficeDto, UpdateOfficeDto} from "../dto/Office.dto.js";

const router = Router()

router.get("/", authenticateToken, OfficeController.getAllOffices)
router.get("/:id", authenticateToken, OfficeController.getOfficeById)
router.post(
    "/",
    authenticateToken,
    authorizeRoles("admin-worker", "manager"),
    validateBody(OfficeDto),
    OfficeController.createOffice
)
router.put(
    "/:id",
    authenticateToken,
    authorizeRoles("admin-worker", "manager"),
    validateBody(UpdateOfficeDto),
    OfficeController.updateOffice)
router.delete("/:id", authenticateToken, authorizeRoles("admin-worker", "manager"), OfficeController.deleteOffice)

export default router
