import express from "express"
import AuthService from "../services/authService.js";

const router = express.Router()

router.post("/login", AuthService.login)
router.post('/logout', (req, res) => {
    return  res.clearCookie('token', {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        path: '/',
    });
});

export default router
