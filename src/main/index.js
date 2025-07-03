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
import requestRatingRoutes from "./routes/requestRatingRoutes.js";
import fs from "node:fs";
import yaml from "yaml";
import swaggerUi from "swagger-ui-express";
import notificationRoutes from "./routes/notificationRoutes.js";
import logger from "./utils/winston/logger.js";


dotenv.config();
await initDb();
await sequelize.authenticate();
const app = express()
const PORT = process.env.PORT || 3001
app.use(cookieParser());

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://kcell-service.vercel.app', 'https://savanoriu-workflow-service-front.vercel.app'],
  credentials: true
}));
app.use(express.json())

const swaggerFile = fs.readFileSync('./swagger.yaml', 'utf8');
const swaggerDocument = yaml.parse(swaggerFile);

app.use((req, res, next) => {
  logger.info('Incoming request', {
    userId: req.user?.id || null,
    endpoint: req.originalUrl,
    method: req.method,
  });
  next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/auth", authRoutes)
app.use("/api/offices", officeRoutes)
app.use("/api/users", userRoutes)
app.use("/api/requests", requestRoutes)
app.use("/api/service-categories", serviceCategoryRoutes)
app.use("/api/executors", executorRoutes)
app.use("/api/request-photos", requestPhotoRoutes)
app.use("/api/ratings", requestRatingRoutes)
app.use("/api/comments", chatMessageRoutes)
app.use("/api/notifications", notificationRoutes)
app.get('/loaderio-4a70b4ed5b728c02002be667ca03f516.txt', (req, res) => {
  res.send('loaderio-4a70b4ed5b728c02002be667ca03f516')
})

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`)
})
