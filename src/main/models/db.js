// backend/models/db.js
import { neon } from "@neondatabase/serverless"

// Используем переменную окружения DATABASE_URL для подключения к Neon
const sql = neon(process.env.DATABASE_URL)

export default sql
