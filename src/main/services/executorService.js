// backend/services/executorService.js
import {Executor} from "../models/init.js"

class ExecutorService {
  static async getAllExecutors() {
    return await Executor.findAll()
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
