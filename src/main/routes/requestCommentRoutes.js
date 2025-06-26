import {Router} from "express"
import RequestCommentController from "../controllers/requestCommentController.js"
import {authenticateToken} from "../middleware/authMiddleware.js"
import {validateBody} from "../middleware/validate.js";
import {CommentDto} from "../dto/RequestComment.dto.js";

const router = Router()

router.get("/", authenticateToken, RequestCommentController.getAllRequestComments)
router.get("/:id", authenticateToken, RequestCommentController.getRequestCommentById)
router.post(
  "/",
  authenticateToken,
  validateBody(CommentDto),
  RequestCommentController.createRequestComment,
)
router.put(
  "/:id",
  authenticateToken,
  validateBody(CommentDto),
  RequestCommentController.updateRequestComment,
)
router.delete(
  "/:id",
  authenticateToken,
  RequestCommentController.deleteRequestComment,
)
router.get("/request/:requestId", authenticateToken, RequestCommentController.getRequestCommentsByRequestId)

export default router
