// backend/auth/authService.js
import UserModel from "../models/userModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

class AuthService {
  static async register(email, password, full_name, position, office_id, role) {
    const existingUser = await UserModel.getByEmail(email)
    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    const newUser = await UserModel.create({ email, password, full_name, position, office_id, role })
    // Не возвращаем хеш пароля
    const { password_hash, ...userWithoutHash } = newUser
    return userWithoutHash
  }

  static async login(email, password) {
    const user = await UserModel.getByEmail(email)
    if (!user) {
      throw new Error("Invalid credentials")
    }

    const isMatch = await bcrypt.compare(password, user.password_hash)
    if (!isMatch) {
      throw new Error("Invalid credentials")
    }

    // Создаем JWT токен
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }, // Токен истекает через 1 час
    )

    // Не возвращаем хеш пароля
    const { password_hash, ...userWithoutHash } = user
    return { token, user: userWithoutHash }
  }
}

export default AuthService
