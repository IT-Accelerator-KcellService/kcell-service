import {Executor, User} from "../models/init.js"

class ExecutorService {
  static async getAllExecutors(department_id) {
    return await Executor.findAll({
      where: {
        department_id: department_id
      },
      include: [{
        model: User,
        as: 'user'
      }]
    })
  }
  static async getExecutorById(id) {
    return await Executor.findByPk(id)
  }
  static async createExecutor(executorData) {
    return await Executor.create(executorData)
  }
  static async updateExecutor(id, updateData) {
    return await Executor.update(id, updateData)
  }
  static async deleteExecutor(id) {
    return await Executor.destroy(id)
  }
}

export default ExecutorService
