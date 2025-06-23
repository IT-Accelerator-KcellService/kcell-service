// backend/controllers/requestController.js
import RequestService from "../services/requestService.js"

class RequestController {
  static async getAllRequests(req, res) {
    try {
      const requests = await RequestService.getAllRequests()
      res.json(requests)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  static async getRequestById(req, res) {
    try {
      const request = await RequestService.getRequestById(Number.parseInt(req.params.id))
      if (request) {
        res.json(request)
      } else {
        res.status(404).json({ message: "Request not found" })
      }
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  static async createRequest(req, res) {
    try {
      const newRequest = await RequestService.createRequest(req.body)
      res.status(201).json(newRequest)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  static async updateRequest(req, res) {
    try {
      const updatedRequest = await RequestService.updateRequest(Number.parseInt(req.params.id), req.body)
      if (updatedRequest) {
        res.json(updatedRequest)
      } else {
        res.status(404).json({ message: "Request not found" })
      }
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  static async deleteRequest(req, res) {
    try {
      const deleted = await RequestService.deleteRequest(Number.parseInt(req.params.id))
      if (deleted) {
        res.status(204).send() // No Content
      } else {
        res.status(404).json({ message: "Request not found" })
      }
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

export default RequestController
