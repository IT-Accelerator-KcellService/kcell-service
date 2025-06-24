import {ChatMessage} from "../models/init.js"

class ChatMessageService {
  static async getAllChatMessages() {
    return await ChatMessage.findAll()
  }
  static async getChatMessageById(id) {
    return await ChatMessage.findByPk(id)
  }
  static async createChatMessage(messageData) {
    return await ChatMessage.create(messageData)
  }
  static async updateChatMessage(id, updateData) {
    return await ChatMessage.update(id, updateData)
  }
  static async deleteChatMessage(id) {
    return await ChatMessage.destroy(id)
  }
  static async getMessagesByRequestId(requestId) {
    return await ChatMessage.getByRequestId(requestId)
  }
}

export default ChatMessageService
