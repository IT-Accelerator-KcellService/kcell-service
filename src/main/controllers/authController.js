// backend/auth/authController.js
import AuthService from "../services/authService.js" // Обратите внимание, что это authService, а не userService

class AuthController {
  static async register(req, res) {
    try {
      const { email, password, full_name, position, office_id, role } = req.body
      const newUser = await AuthService.register(email, password, full_name, position, office_id, role)
      res.status(201).json({ message: "User registered successfully", user: newUser })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body
      const { token, user } = await AuthService.login(email, password)
      res.json({ message: "Logged in successfully", token, user })
    } catch (error) {
      res.status(401).json({ message: error.message })
    }
  }
}

export default AuthController
