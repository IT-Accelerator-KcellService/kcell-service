import express from "express";
import {authenticateToken, authorizeRoles} from "../middleware/authMiddleware.js";
import AnalyticController from "../controllers/analyticController.js";

const router = express.Router();

router.get("/export", authenticateToken, authorizeRoles("manager"), AnalyticController.exportAnalytics);
// router.post("/email", authenticateToken, authorizeRoles("manager"), AnalyticController.emailAnalytics);

export default router;