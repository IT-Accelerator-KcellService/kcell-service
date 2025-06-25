import express from "express"
import cors from "cors"
import authRoutes from "./routes/authRoutes.js"
import officeRoutes from "./routes/officeRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import requestRoutes from "./routes/requestRoutes.js"
import serviceCategoryRoutes from "./routes/serviceCategoryRoutes.js"
import executorRoutes from "./routes/executorRoutes.js"
import requestPhotoRoutes from "./routes/requestPhotoRoutes.js"
import chatMessageRoutes from "./routes/requestCommentRoutes.js"
import {initDb, sequelize} from "./config/database.js";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import {errorHandler} from "./middleware/errorHandler.js";

dotenv.config();
await initDb();
await sequelize.authenticate();
const app = express()
const PORT = process.env.PORT || 3001
app.use(cookieParser());

app.use(cors({ origin: "http://localhost:3000", credentials: true }))
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/offices", officeRoutes)
app.use("/api/users", userRoutes)
app.use("/api/requests", requestRoutes)
app.use("/api/service-categories", serviceCategoryRoutes)
app.use("/api/executors", executorRoutes)
app.use("/api/request-photos", requestPhotoRoutes)
app.use("/api/comments", chatMessageRoutes)

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`)
})
