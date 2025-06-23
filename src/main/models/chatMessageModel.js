// backend/models/chatMessageModel.js
import sql from "./db.js"

class ChatMessageModel {
  static async getAll() {
    const messages = await sql`SELECT * FROM chat_messages`
    return messages
  }
  static async getById(id) {
    const [message] = await sql`SELECT * FROM chat_messages WHERE id = ${id}`
    return message || null
  }
  static async create(newMessage) {
    const { request_id, sender_id, message_text } = newMessage
    const [message] = await sql`
      INSERT INTO chat_messages (request_id, sender_id, message_text, timestamp)
      VALUES (${request_id}, ${sender_id}, ${message_text}, NOW())
      RETURNING *
    `
    return message
  }
  static async update(id, updatedFields) {
    const fieldsToUpdate = Object.keys(updatedFields)
      .map((key) => sql`${sql(key)} = ${updatedFields[key]}`)
      .join(sql`, `)

    if (fieldsToUpdate.length === 0) return null

    const [message] = await sql`
      UPDATE chat_messages
      SET ${fieldsToUpdate}
      WHERE id = ${id}
      RETURNING *
    `
    return message || null
  }
  static async delete(id) {
    const result = await sql`DELETE FROM chat_messages WHERE id = ${id}`
    return result.count > 0
  }
  static async getByRequestId(requestId) {
    const messages = await sql`SELECT * FROM chat_messages WHERE request_id = ${requestId} ORDER BY timestamp ASC`
    return messages
  }
}

export default ChatMessageModel
