import UserService from "./userService.js";
import {Executor, Request, RequestPhoto, ServiceCategory, User} from "../models/init.js"
import NotificationService from "./notificationService.js";
import {BadRequestError, ForbiddenError, NotFoundError} from "../errors/errors.js";
import {Op} from "sequelize";

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

      const request = await Request.findByPk(id);
      if (!request) {
        throw new NotFoundError('Request not found');
      }
      const destroyResult = await request.destroy();

      NotificationService.sendNotification({
        userId: request.client_id,
        requestId: request.id,
        type: 'reject_request',
        content: data.rejection_reason
      })
      return destroyResult;
    } else if (data.status === 'awaiting_assignment') {
      const { status, complexity, sla, category_id } = data;
      if (!complexity && !sla && !category_id) {
        throw new Error('complexity, sla, description is required when status is awaiting_assignment');
      }

      const request = await Request.findByPk(id);
      if (!request) {
        throw new NotFoundError('Request not found');
      }
      request.status = status;
      request.complexity = complexity;
      request.sla = sla;
      request.category_id = category_id;
      await request.save();

      NotificationService.sendNotification({
        userId: request.client_id,
        requestId: request.id,
        type: 'reject_request'
      })
      return request;
    }
    throw new Error('Unsupported status value');
  }

  static async getDepartmentHeadRequests(userId) {
    const user = await User.findByPk(userId)

    const allRequests = await Request.findAll({
      where: {
        [Op.and]: [
          { office_id: user.office_id },
          {
            [Op.or]: [
              { client_id: userId },
              { status: 'awaiting_assignment' }
            ]
          }
        ]
      },
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
    const myRequests = allRequests.filter(req => req.client_id === userId);
    const otherRequests = allRequests.filter(req => req.client_id !== userId);

    return {myRequests, otherRequests};
  }

  static async assignExecutor(requestId, executorId, userId) {
    const request = await Request.findByPk(requestId);
    if (!request) {
      throw new NotFoundError('Request not found');
    }
    const executor = await Executor.findOne({
      where: { user_id: executorId },
      include: {
        model: User,
        as: 'user'
      }
    });
    if (!executor) {
      throw new NotFoundError('Executor not found');
    } else if (executor.role !== 'executor') {
      throw new BadRequestError('Error executor');
    } else if (executor.department_id === userId) {
      throw new ForbiddenError('Forbidden');
    }

    request.executor_id = executorId;
    await request.save();

    return request;
  }
}

export default RequestService
