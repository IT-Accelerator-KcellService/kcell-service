import UserService from "./userService.js";
import {Executor, Request, RequestPhoto, ServiceCategory, User} from "../models/init.js"
import NotificationService from "./notificationService.js";
import {BadRequestError, ForbiddenError, NotFoundError} from "../errors/errors.js";
import {Op} from "sequelize";

class RequestService {
  static async getAllRequests() {
    return await Request.findAll({
      include: [
        { model: RequestPhoto, as: 'photos' },
        {
          model: User,
          as: 'client',
          attributes: ['id', 'full_name']
        },
        {
          model: Executor, as: 'executor',  attributes: ['id', 'specialty'],
          include: [
              { model: User, as: 'user' , attributes: ['id', 'full_name'] },
          ]
        },
        { model: ServiceCategory, as: 'category' },
      ],
    })
  }

  static async getRequestById(id) {
    return await Request.findByPk(id, {
      include: [
        { model: RequestPhoto, as: "photos" },
        {
          model: Executor, as: 'executor',  attributes: ['id', 'specialty'],
          include: [
            { model: User, as: 'user' , attributes: ['id', 'full_name'] },
          ]
        },
        { model: User, as: 'client', attributes: ['id', 'full_name'] },
        { model: ServiceCategory, as: 'category' }
        ]
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
    return await this.getRequestById(request.id);
  }

  static async getRequestsByUser(userId) {
    return await Request.findAll({
      where: {
        client_id: userId
      },
      include: [
        { model: RequestPhoto, as: 'photos' },
        {
          model: User,
          as: 'client',
          attributes: ['id', 'full_name']
        },
        { model: ServiceCategory, as: 'category' },
        {
          model: Executor, as: 'executor',  attributes: ['id', 'specialty'],
          include: [
            { model: User, as: 'user' , attributes: ['id', 'full_name'] },
          ]
        },
      ]
    });
  }

  static async updateRequest(id, updateData) {
    return await Request.update(updateData, {
      where: {id:id}
    })
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
        {
          model: Executor, as: 'executor',  attributes: ['id', 'specialty'],
          include: [
            { model: User, as: 'user' , attributes: ['id', 'full_name'] },
          ]
        },
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
      const destroyResult = await request.destroy({
        where: {id: request.id}
      });

      NotificationService.sendNotification({
        userId: request.client_id,
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
        type: 'awaiting_assignment'
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
        {
          model: Executor, as: 'executor',  attributes: ['id', 'specialty'],
          include: [
            { model: User, as: 'user' , attributes: ['id', 'full_name'] },
          ]
        },
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
    } else if (executor.user.role !== 'executor') {
      throw new BadRequestError('Error executor');
    } else if (executor.department_id !== userId) {
      throw new ForbiddenError('Forbidden');
    }

    request.executor_id = executor.id;
    request.status = 'assigned';
    await request.save();

    return request;
  }

  static async getExecutorRequests(userId) {
    const executor = await Executor.findOne({
      where: {user_id: userId}
    });
    const allRequests = await Request.findAll({
      where: {
        [Op.or]: [
          { executor_id: executor.id },
          { client_id: userId }
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
        {
          model: Executor, as: 'executor',  attributes: ['id', 'specialty'],
          include: [
            { model: User, as: 'user' , attributes: ['id', 'full_name'] },
          ]
        },
      ]
    })
    const myRequests = allRequests.filter(req => req.client_id === userId);
    const assignedRequests = allRequests.filter(req => req.status !== 'completed' && req.client_id !== userId);
    const completedRequests = allRequests.filter(req => req.status === 'completed' && req.client_id !== userId);

    return {assignedRequests, completedRequests, myRequests};
  }

  static async startRequest(requestId, userId) {
    const request = await Request.findByPk(requestId, {
      include: [
          { model: Executor, as: 'executor' }
      ]
    });
    if (!request) {
      throw new NotFoundError('Request not found');
    }
    if (request.executor.user_id !== userId) {
      throw new ForbiddenError('Forbidden');
    }
    request.status = 'execution';
    request.date_submitted = Date.now();
    return await request.save();
  }

  static async finishRequest(requestId, userId, comment) {
    const request = await Request.findByPk(requestId, {
      include: [
          { model: Executor, as: 'executor' }
      ]
    });
    if (!request) {
      throw new NotFoundError('Request not found');
    }
    if (request.executor.user_id !== userId) {
      throw new ForbiddenError('Forbidden');
    }
    request.status = 'completed';
    request.actual_completion_date = Date.now();
    request.comment = comment;
    return await request.save();
  }
}

export default RequestService
