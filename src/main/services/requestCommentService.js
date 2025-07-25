import {RequestComment, User} from "../models/init.js"
import {NotFoundError} from "../errors/errors.js";

class RequestCommentService {
  static async getAllChatMessages() {
    return await RequestComment.findAll()
  }

  static async getChatMessageById(id) {
    const message = await RequestComment.findByPk(id)
    if (!message) {
      throw new NotFoundError("Message not found")
    }
    return message
  }

  static async createChatMessage(user_id, messageData) {
    messageData.sender_id = user_id
    return await RequestComment.create(messageData)
  }

  static async updateChatMessage(id, updateData) {
    const requestComment = await RequestComment.findByPk(id)
    if (!requestComment) {
      throw new NotFoundError("Comment not found")
    }
    requestComment.comment = updateData.comment
    return await requestComment.save()
  }

  static async deleteChatMessage(id) {
    const deleted = await RequestComment.destroy({where: {id}})
    if (!deleted) {
      throw new NotFoundError("chat not found")
    }
    return deleted
  }

  static async getMessagesByRequestId(requestId) {
    return await RequestComment.findAll({
      where: { request_id: requestId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'role']
        }
      ],
      order: [['timestamp', 'ASC']]
    });
  }
}

export default RequestCommentService
