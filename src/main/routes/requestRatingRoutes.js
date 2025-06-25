import { Router } from "express";
import {
    createRequestRating,
    getAllRequestRatings,
    getRequestRatingById,
    deleteRequestRating
} from "../controllers/requestRatingController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authenticateToken, createRequestRating);
router.get("/", authenticateToken, getAllRequestRatings);
router.get("/:id", authenticateToken, getRequestRatingById);
router.delete("/:id", authenticateToken, deleteRequestRating);

export default router;
