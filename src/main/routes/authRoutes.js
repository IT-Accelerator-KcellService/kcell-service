import express from "express"
import AuthService from "../services/authService.js";

const router = express.Router()

router.post("/login", AuthService.login)
router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        path: '/',
    }).redirect(process.env.FRONTEND_URL + "/login");
});

export default router
