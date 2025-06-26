import UserService from "./userService.js";
import {Request, RequestPhoto, ServiceCategory, User} from "../models/init.js"
import NotificationService from "./notificationService.js";
import {NotFoundError} from "../errors/errors.js";

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
    const request = await Request.create({
      client_id: id,
      office_id: user.office_id,
      ...requestData
    });
    NotificationService.sendNotification({
      userId: id,
      requestId: request.id,
      type: 'new_request'
    });
    return request;
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
      const destroyResult = await Request.destroy({ where: { id } });
      const rejectedUser = await User.findByPk(id);
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: rejectedUser.email,
        subject: 'Request Rejected',
        text: `Your request has been rejected. Reason: ${data.rejection_reason}`
      });
      return destroyResult;
    } else if (data.status === 'awaiting_assignment') {
      const { status, complexity, sla, category_id } = data;
      if (!complexity && !sla && !category_id) {
        throw new Error('complexity, sla, description is required when status is awaiting_assignment');
      }
      const updatedUser = await User.findByPk(id);
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: updatedUser.email,
        subject: 'Request Awaiting Assignment',
        text: 'Your request status has been updated to awaiting assignment.'
      });
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
