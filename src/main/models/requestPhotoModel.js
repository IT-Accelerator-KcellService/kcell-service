// backend/models/requestPhotoModel.js
import sql from "./db.js"

class RequestPhotoModel {
  static async getAll() {
    const photos = await sql`SELECT * FROM request_photos`
    return photos
  }
  static async getById(id) {
    const [photo] = await sql`SELECT * FROM request_photos WHERE id = ${id}`
    return photo || null
  }
  static async create(newPhoto) {
    const { request_id, photo_url } = newPhoto
    const [photo] = await sql`
      INSERT INTO request_photos (request_id, photo_url)
      VALUES (${request_id}, ${photo_url})
      RETURNING *
    `
    return photo
  }
  static async update(id, updatedFields) {
    const fieldsToUpdate = Object.keys(updatedFields)
      .map((key) => sql`${sql(key)} = ${updatedFields[key]}`)
      .join(sql`, `)

    if (fieldsToUpdate.length === 0) return null

    const [photo] = await sql`
      UPDATE request_photos
      SET ${fieldsToUpdate}
      WHERE id = ${id}
      RETURNING *
    `
    return photo || null
  }
  static async delete(id) {
    const result = await sql`DELETE FROM request_photos WHERE id = ${id}`
    return result.count > 0
  }
  static async getByRequestId(requestId) {
    const photos = await sql`SELECT * FROM request_photos WHERE request_id = ${requestId}`
    return photos
  }
}

export default RequestPhotoModel
