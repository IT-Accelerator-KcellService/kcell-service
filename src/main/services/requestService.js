// backend/services/requestService.js
import {Request} from "../models/init.js"

class RequestService {
  static async getAllRequests() {
    return await Request.findAll()
  }

  static async getRequestById(id) {
    return await Request.findByPk(id)
  }

  static async createRequest(requestData) {
    return await Request.create(requestData)
  }

  static async updateRequest(id, updateData) {
    return await Request.update(id, updateData)
  }

  static async deleteRequest(id) {
    return await Request.destroy(id)
  }
}

export default RequestService
