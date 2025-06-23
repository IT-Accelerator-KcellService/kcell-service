// backend/controllers/chatMessageController.js
import ChatMessageService from "../services/chatMessageService.js"

class ChatMessageController {
  static async getAllChatMessages(req, res) {
    try {
      const messages = await ChatMessageService.getAllChatMessages()
      res.json(messages)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  static async getChatMessageById(req, res) {
    try {
      const message = await ChatMessageService.getChatMessageById(Number.parseInt(req.params.id))
      if (message) {
        res.json(message)
      } else {
        res.status(404).json({ message: "Chat message not found" })
      }
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  static async createChatMessage(req, res) {
    try {
      const newMessage = await ChatMessageService.createChatMessage(req.body)
      res.status(201).json(newMessage)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  static async updateChatMessage(req, res) {
    try {
      const updatedMessage = await ChatMessageService.updateChatMessage(Number.parseInt(req.params.id), req.body)
      if (updatedMessage) {
        res.json(updatedMessage)
      } else {
        res.status(404).json({ message: "Chat message not found" })
      }
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  static async deleteChatMessage(req, res) {
    try {
      const deleted = await ChatMessageService.deleteChatMessage(Number.parseInt(req.params.id))
      if (deleted) {
        res.status(204).send()
      } else {
        res.status(404).json({ message: "Chat message not found" })
      }
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  static async getMessagesByRequestId(req, res) {
    try {
      const messages = await ChatMessageService.getMessagesByRequestId(Number.parseInt(req.params.requestId))
      res.json(messages)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

export default ChatMessageController
