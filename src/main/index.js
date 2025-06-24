// backend/index.js
import express from "express"
import cors from "cors"
import dotenv from "dotenv"

// Импорт маршрутов
import authRoutes from "./routes/authRoutes.js"
import officeRoutes from "./routes/officeRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import requestRoutes from "./routes/requestRoutes.js"
import serviceCategoryRoutes from "./routes/serviceCategoryRoutes.js"
import executorRoutes from "./routes/executorRoutes.js"
import requestPhotoRoutes from "./routes/requestPhotoRoutes.js"
import chatMessageRoutes from "./routes/chatMessageRoutes.js"
import {initDb, sequelize} from "./config/database.js";

dotenv.config() // Загружаем переменные окружения из .env
await initDb();
await sequelize.authenticate();
const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({ origin: "http://localhost:3000" })) // Разрешаем запросы с фронтенда Next.js
app.use(express.json()) // Для парсинга JSON-тел запросов

// Маршруты API
app.use("/api/auth", authRoutes)
app.use("/api/offices", officeRoutes)
app.use("/api/users", userRoutes)
app.use("/api/requests", requestRoutes)
app.use("/api/service-categories", serviceCategoryRoutes)
app.use("/api/executors", executorRoutes)
app.use("/api/request-photos", requestPhotoRoutes)
app.use("/api/chat-messages", chatMessageRoutes)

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`)
})
