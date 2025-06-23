// backend/models/executorModel.js
import sql from "./db.js"

class ExecutorModel {
  static async getAll() {
    const executors = await sql`SELECT * FROM executors`
    return executors
  }
  static async getById(id) {
    const [executor] = await sql`SELECT * FROM executors WHERE id = ${id}`
    return executor || null
  }
  static async create(newExecutor) {
    const { user_id, specialty, rating, workload } = newExecutor
    const [executor] = await sql`
      INSERT INTO executors (user_id, specialty, rating, workload)
      VALUES (${user_id}, ${specialty}, ${rating}, ${workload})
      RETURNING *
    `
    return executor
  }
  static async update(id, updatedFields) {
    const fieldsToUpdate = Object.keys(updatedFields)
      .map((key) => sql`${sql(key)} = ${updatedFields[key]}`)
      .join(sql`, `)

    if (fieldsToUpdate.length === 0) return null

    const [executor] = await sql`
      UPDATE executors
      SET ${fieldsToUpdate}
      WHERE id = ${id}
      RETURNING *
    `
    return executor || null
  }
  static async delete(id) {
    const result = await sql`DELETE FROM executors WHERE id = ${id}`
    return result.count > 0
  }
}

export default ExecutorModel
