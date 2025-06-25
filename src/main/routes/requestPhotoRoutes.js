import { Router } from "express"
import RequestPhotoController from "../controllers/requestPhotoController.js"
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware.js"
import multer from "multer";

const upload = multer()
const router = Router()

router.get("/", authenticateToken, RequestPhotoController.getAllRequestPhotos)
router.get("/:id", authenticateToken, RequestPhotoController.getRequestPhotoById)
router.post(
  "/",
  authenticateToken,
  authorizeRoles("client", "admin-worker", "executor", "manager"),
  RequestPhotoController.createRequestPhoto,
)
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("admin-worker", "manager"),
  RequestPhotoController.updateRequestPhoto,
)
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin-worker", "manager"),
  RequestPhotoController.deleteRequestPhoto,
)
router.get("/request/:requestId", authenticateToken, RequestPhotoController.getPhotosByRequestId)

router.post(
    "/:id/photos",
    authenticateToken,
    upload.array("photos"),
    RequestPhotoController.uploadPhotos,
)

export default router
