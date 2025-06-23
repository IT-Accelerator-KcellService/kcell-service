// backend/models/officeModel.js
import sql from "./db.js"

class OfficeModel {
  static async getAll() {
    const offices = await sql`SELECT * FROM offices`
    return offices
  }

  static async getById(id) {
    const [office] = await sql`SELECT * FROM offices WHERE id = ${id}`
    return office || null
  }

  static async create(newOffice) {
    const { name } = newOffice
    const [office] = await sql`
      INSERT INTO offices (name)
      VALUES (${name})
      RETURNING *
    `
    return office
  }

  static async update(id, updatedFields) {
    const fieldsToUpdate = Object.keys(updatedFields)
      .map((key) => sql`${sql(key)} = ${updatedFields[key]}`)
      .join(sql`, `)

    if (fieldsToUpdate.length === 0) return null

    const [office] = await sql`
      UPDATE offices
      SET ${fieldsToUpdate}
      WHERE id = ${id}
      RETURNING *
    `
    return office || null
  }

  static async delete(id) {
    const result = await sql`DELETE FROM offices WHERE id = ${id}`
    return result.count > 0
  }
}

export default OfficeModel
