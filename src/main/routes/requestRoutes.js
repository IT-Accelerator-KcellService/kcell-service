import {Router} from "express"
import RequestController from "../controllers/requestController.js"
import {authenticateToken, authorizeRoles} from "../middleware/authMiddleware.js"
import {validateBody} from "../middleware/validate.js";
import {AdminWorkerRequestStatus} from "../dto/Request.dto.js";

const router = Router()

router.post(
  "/",
  authenticateToken,
  authorizeRoles("client", "admin-worker", "manager","department-head"),
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
router.patch(
    "/status/:id",
    authenticateToken,
    authorizeRoles("admin-worker"),
    validateBody(AdminWorkerRequestStatus),
    RequestController.updateRequestStatus
)

router.get(
    "/department-head/me",
    authenticateToken,
    authorizeRoles("department-head"),
    RequestController.getDepartmentHeadRequests
)
router.patch(
    "/:id/assign-executor/:executor_id",
    authenticateToken,
    authorizeRoles("department-head"),
    RequestController.assignExecutor
)

export default router
