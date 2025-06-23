// backend/models/userModel.js
import sql from "./db.js"
import bcrypt from "bcryptjs"

class UserModel {
  static async getAll() {
    const users = await sql`SELECT id, email, full_name, position, office_id, role FROM users`
    return users
  }

  static async getById(id) {
    const [user] = await sql`SELECT id, email, full_name, position, office_id, role FROM users WHERE id = ${id}`
    return user || null
  }

  static async getByEmail(email) {
    const [user] = await sql`SELECT * FROM users WHERE email = ${email}`
    return user || null
  }

  static async create(newUser) {
    const { email, password, full_name, position, office_id, role } = newUser
    const password_hash = await bcrypt.hash(password, 10) // Хешируем пароль
    const [user] = await sql`
      INSERT INTO users (email, password_hash, full_name, position, office_id, role)
      VALUES (${email}, ${password_hash}, ${full_name}, ${position}, ${office_id}, ${role})
      RETURNING id, email, full_name, position, office_id, role
    `
    return user
  }

  static async update(id, updatedFields) {
    const fieldsToUpdate = Object.keys(updatedFields)
      .map((key) => {
        if (key === "password") {
          // Если обновляем пароль, хешируем его
          return sql`${sql(key)} = ${bcrypt.hashSync(updatedFields[key], 10)}`
        }
        return sql`${sql(key)} = ${updatedFields[key]}`
      })
      .join(sql`, `)

    if (fieldsToUpdate.length === 0) return null

    const [user] = await sql`
      UPDATE users
      SET ${fieldsToUpdate}
      WHERE id = ${id}
      RETURNING id, email, full_name, position, office_id, role
    `
    return user || null
  }

  static async delete(id) {
    const result = await sql`DELETE FROM users WHERE id = ${id}`
    return result.count > 0
  }
}

export default UserModel
