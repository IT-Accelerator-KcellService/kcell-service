import express from "express";
import {authorizeRoles} from "../middleware/authMiddleware.js";
import AnalyticController from "../controllers/analyticController.js";

const router = express.Router();

router.get("/export", authorizeRoles("manager"), AnalyticController.exportAnalytics);
// router.post("/email", authorizeRoles("manager"), AnalyticController.emailAnalytics);

router.get('/stats/client', authorizeRoles('client'), AnalyticController.getClientStats);
router.get('/stats/admin-worker', authorizeRoles('admin-worker'), AnalyticController.getAdminWorkerStats);
router.get('/stats/department-head', authorizeRoles('department-head'), AnalyticController.getDepartmentHeadStats);
router.get('/stats/executor', authorizeRoles('executor'), AnalyticController.getExecutorStats);
router.get('/stats/manager', authorizeRoles('manager'), AnalyticController.getManagerStats);

export default router;