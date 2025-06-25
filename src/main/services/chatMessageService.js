import {ChatMessage} from "../models/init.js"
import {NotFoundError} from "../errors/errors.js";

class ChatMessageService {
  static async getAllChatMessages() {
    return await ChatMessage.findAll()
  }

  static async getChatMessageById(id) {
    const message = await ChatMessage.findByPk(id)
    if (!message) {
      throw new NotFoundError("Message not found")
    }
    return message
  }

  static async createChatMessage(messageData) {
    return await ChatMessage.create(messageData)
  }
  static async updateChatMessage(id, updateData) {
    const updated = await ChatMessage.update(id, updateData)
    if (!updated) {
      throw new NotFoundError("Chat not found")
    }
    return await ChatMessage.findByPk(id)
  }

  static async deleteChatMessage(id) {
    const deleted = await ChatMessage.destroy(id)
    if (!deleted) {
      throw new NotFoundError("chat not found")
    }
    return deleted
  }

  static async getMessagesByRequestId(requestId) {
    return await ChatMessage.findAll({where: {request_id: requestId}})
  }
}

export default ChatMessageService
