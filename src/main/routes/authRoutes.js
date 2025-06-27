import express from "express"
import AuthService from "../services/authService.js";

const router = express.Router()

router.post("/login", AuthService.login)
router.post('/logout', (req, res) => {
    return  res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
    }).status(200).json({ message: 'Logged out' });
});

export default router
