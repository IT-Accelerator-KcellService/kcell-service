// backend/models/serviceCategoryModel.js
import sql from "./db.js"

class ServiceCategoryModel {
  static async getAll() {
    const categories = await sql`SELECT * FROM service_categories`
    return categories
  }
  static async getById(id) {
    const [category] = await sql`SELECT * FROM service_categories WHERE id = ${id}`
    return category || null
  }
  static async create(newCategory) {
    const { name } = newCategory
    const [category] = await sql`
      INSERT INTO service_categories (name)
      VALUES (${name})
      RETURNING *
    `
    return category
  }
  static async update(id, updatedFields) {
    const fieldsToUpdate = Object.keys(updatedFields)
      .map((key) => sql`${sql(key)} = ${updatedFields[key]}`)
      .join(sql`, `)

    if (fieldsToUpdate.length === 0) return null

    const [category] = await sql`
      UPDATE service_categories
      SET ${fieldsToUpdate}
      WHERE id = ${id}
      RETURNING *
    `
    return category || null
  }
  static async delete(id) {
    const result = await sql`DELETE FROM service_categories WHERE id = ${id}`
    return result.count > 0
  }
}

export default ServiceCategoryModel
