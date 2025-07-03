import {Executor, Request, RequestRating, User} from "../models/init.js"
import {col, fn, literal} from "sequelize";
import logger from "../utils/winston/logger.js";

class ExecutorService {
  static async getAllExecutors(department_id) {
    const executors = await Executor.findAll({
      where: { department_id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email']
        },
        {
          model: Request,
          as: 'requests',
          attributes: [],
          where: {
            status: 'execution'
          },
          required: false
        },
        {
          model: Request,
          as: 'requests',
          attributes: [],
          required: false,
          include: [
            {
              model: RequestRating,
              as: 'ratings',
              attributes: []
            }
          ]
        }
      ],
      attributes: {
        include: [
          // количество заявок в статусе execution
          [
            fn('COUNT', col('requests.id')),
            'workload'
          ],
          // средняя оценка
          [
            literal(`(
            SELECT AVG(rating)
            FROM request_ratings AS rr
            INNER JOIN requests AS r ON rr.request_id = r.id
            WHERE r.executor_id = "Executor"."id"
          )`),
            'rating'
          ]
        ]
      },
      group: ['Executor.id', 'user.id'],
    });

    return executors;
  }
  static async getExecutorById(id) {
    return await Executor.findByPk(id)
  }
  static async getExecutorByUserId(id) {
    return await Executor.findOne({
      user_id : id,
    })
  }
  static async getAverageRatingByExecutorId(userId) {
    const executor = await ExecutorService.getExecutorByUserId(userId);
    logger.info(executor)
    if (!executor) return 0;

    const result = await RequestRating.findOne({
      attributes: [
        [fn('AVG', col('rating')), 'average_rating']
      ],
      include: [
        {
          model: Request,
          attributes: [],
          where: {
            executor_id: executor.id
          }
        }
      ],
      raw: true
    });

    return Number(result?.average_rating || 0);
  }

  static async createExecutor(executorData) {
    return await Executor.create(executorData)
  }
  static async updateExecutor(id, updateData) {
    return await Executor.update(updateData, {
      where: {id: id}
    })
  }
  static async deleteExecutor(id) {
    return await Executor.destroy({
      where: {id: id}
    })
  }
}

export default ExecutorService
