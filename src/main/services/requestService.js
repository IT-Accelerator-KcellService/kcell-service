import UserService from "./userService.js";
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
    const user= await UserService.getUserById(id)
    return await Request.create({
      client_id: id,
      office_id: user.office_id,
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
    return await Request.destroy({ where: { id } });
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
      return await Request.destroy({where: {id}});
    } else if (data.status === 'awaiting_assignment') {
      console.log(data);
      const { status, complexity, sla, category_id } = data;
      if (!complexity && !sla && !category_id) {
        throw new Error('complexity, sla, description is required when status is awaiting_assignment');
      }
      return await Request.update(
        {
          status,
          complexity,
          sla,
          category_id,
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
