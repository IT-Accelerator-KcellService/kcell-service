// backend/models/requestModel.js
import sql from "./db.js"

class RequestModel {
  static async getAll() {
    const requests = await sql`SELECT * FROM requests ORDER BY date_submitted DESC`
    return requests
  }

  static async getById(id) {
    const [request] = await sql`SELECT * FROM requests WHERE id = ${id}`
    return request || null
  }

  static async create(newRequest) {
    const {
      request_type,
      title,
      description,
      client_id,
      office_id,
      location_detail,
      status,
      category_id,
      complexity,
      sla,
      executor_id,
      admin_worker_id,
      progress,
      rating,
      planned_completion_date,
      actual_completion_date,
      rejection_reason,
    } = newRequest

    // Генерируем request_id_display
    const lastRequest = await sql`SELECT request_id_display FROM requests ORDER BY id DESC LIMIT 1`
    let nextIdNum = 1
    if (lastRequest.length > 0) {
      const lastId = lastRequest[0].request_id_display
      const numMatch = lastId.match(/REQ-(\d+)/)
      if (numMatch) {
        nextIdNum = Number.parseInt(numMatch[1], 10) + 1
      }
    }
    const request_id_display = `REQ-${nextIdNum.toString().padStart(3, "0")}`

    const [request] = await sql`
      INSERT INTO requests (
        request_id_display, request_type, title, description, client_id, office_id,
        location_detail, date_submitted, status, category_id, complexity, sla,
        executor_id, admin_worker_id, progress, rating, planned_completion_date,
        actual_completion_date, rejection_reason
      ) VALUES (
        ${request_id_display}, ${request_type}, ${title}, ${description}, ${client_id}, ${office_id},
        ${location_detail}, NOW(), ${status || "Новая"}, ${category_id}, ${complexity}, ${sla},
        ${executor_id}, ${admin_worker_id}, ${progress || 0}, ${rating}, ${planned_completion_date},
        ${actual_completion_date}, ${rejection_reason}
      )
      RETURNING *
    `
    return request
  }

  static async update(id, updatedFields) {
    const fieldsToUpdate = Object.keys(updatedFields)
      .map((key) => sql`${sql(key)} = ${updatedFields[key]}`)
      .join(sql`, `)

    if (fieldsToUpdate.length === 0) return null

    const [request] = await sql`
      UPDATE requests
      SET ${fieldsToUpdate}
      WHERE id = ${id}
      RETURNING *
    `
    return request || null
  }

  static async delete(id) {
    const result = await sql`DELETE FROM requests WHERE id = ${id}`
    return result.count > 0
  }
}

export default RequestModel
