import { Router } from "express"
import AuthService from "../services/authService.js";

const router = Router()


router.post("/login", AuthService.login)

export default router
