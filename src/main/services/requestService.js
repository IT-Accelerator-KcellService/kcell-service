import {Request, RequestPhoto} from "../models/init.js"

class RequestService {
  static async getAllRequests() {
    return await Request.findAll({
      include: [{ model: RequestPhoto, as: 'photos' }],
    })
  }

  static async getRequestById(id) {
    return await Request.findByPk(id, {
      include: [{ model: RequestPhoto, as: "photos" }]
    })
  }

  static async createRequest(id, requestData) {
    return await Request.create({
      client_id: id,
      ...requestData
    });
  }
  static async getRequestsByUser(userId) {
    return await Request.findAll({
      where: {
        client_id: userId
      }
    });
  }

  static async updateRequest(id, updateData) {
    return await Request.update(id, updateData)
  }

  static async deleteRequest(id) {
    return await Request.destroy(id)
  }
}

export default RequestService
