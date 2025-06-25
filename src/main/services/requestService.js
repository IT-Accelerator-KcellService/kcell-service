import {Request, User} from "../models/init.js"

class RequestService {
  static async getAllRequests() {
    return await Request.findAll()
  }

  static async getRequestById(id) {
    return await Request.findByPk(id)
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

  static async getAdminWorkerRequests(id) {
    const user = await User.findByPk(id)
    const allRequests = await Request.findAll({
      where: {office_id: user.office_id}
    });
    const myRequests = allRequests.filter(req => req.client_id === id);
    const otherRequests = allRequests.filter(req => req.client_id !== id);

    return {myRequests, otherRequests};
  }
}

export default RequestService
