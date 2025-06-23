// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken"

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

  if (token == null) {
    return res.status(401).json({ message: "Authentication token required" })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" })
    }
    req.user = user // Добавляем данные пользователя из токена в объект запроса
    next()
  })
}

// Middleware для проверки роли пользователя
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied: Insufficient permissions" })
    }
    next()
  }
}

export { authenticateToken, authorizeRoles }
