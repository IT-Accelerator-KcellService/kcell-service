// backend/services/requestService.js
import RequestModel from "../models/requestModel.js"

class RequestService {
  static async getAllRequests() {
    return await RequestModel.getAll()
  }

  static async getRequestById(id) {
    return await RequestModel.getById(id)
  }

  static async createRequest(requestData) {
    return await RequestModel.create(requestData)
  }

  static async updateRequest(id, updateData) {
    return await RequestModel.update(id, updateData)
  }

  static async deleteRequest(id) {
    return await RequestModel.delete(id)
  }
}

export default RequestService
