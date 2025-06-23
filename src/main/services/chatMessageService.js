// backend/services/chatMessageService.js
import ChatMessageModel from "../models/chatMessageModel.js"

class ChatMessageService {
  static async getAllChatMessages() {
    return await ChatMessageModel.getAll()
  }
  static async getChatMessageById(id) {
    return await ChatMessageModel.getById(id)
  }
  static async createChatMessage(messageData) {
    return await ChatMessageModel.create(messageData)
  }
  static async updateChatMessage(id, updateData) {
    return await ChatMessageModel.update(id, updateData)
  }
  static async deleteChatMessage(id) {
    return await ChatMessageModel.delete(id)
  }
  static async getMessagesByRequestId(requestId) {
    return await ChatMessageModel.getByRequestId(requestId)
  }
}

export default ChatMessageService
