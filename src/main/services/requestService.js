import {Request, RequestPhoto, ServiceCategory, User} from "../models/init.js"

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

  static async getAdminWorkerRequests(id) {
    const user = await User.findByPk(id)
    const allRequests = await Request.findAll({
      where: { office_id: user.office_id },
      include: [
          { model: RequestPhoto, as: 'photos' },
        {
          model: User,
          as: 'client',
          attributes: ['id', 'full_name']
        },
        { model: ServiceCategory, as: 'category' },
      ]
    });
    const myRequests = allRequests.filter(req => req.client_id === id);
    const otherRequests = allRequests.filter(req => req.client_id !== id);

    return {myRequests, otherRequests};
  }

  static async updateRequestStatus(id, data) {
    if (data.status === 'rejected') {
      if (!data.rejection_reason || data.rejection_reason.trim() === '') {
        throw new Error('Rejection reason is required when status is rejected');
      }
      return await Request.update(
        {
          status: data.status,
          rejection_reason: data.rejection_reason,
        },
        {
          where: { id },
        }
      );
    } else if (data.status === 'awaiting_assignment') {
      const { status, complexity, sla, description } = data;
      if (!data.complexity && !data.sla && !data.description) {
        throw new Error('complexity, sla, description is required when status is awaiting_assignment');
      }
      return await Request.update(
        {
          status,
          complexity,
          sla,
          description,
        },
        {
          where: { id },
        }
      );
    }
    throw new Error('Unsupported status value');
  }
}

export default RequestService
