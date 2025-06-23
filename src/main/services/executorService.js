// backend/services/executorService.js
import ExecutorModel from "../models/executorModel.js"

class ExecutorService {
  static async getAllExecutors() {
    return await ExecutorModel.getAll()
  }
  static async getExecutorById(id) {
    return await ExecutorModel.getById(id)
  }
  static async createExecutor(executorData) {
    return await ExecutorModel.create(executorData)
  }
  static async updateExecutor(id, updateData) {
    return await ExecutorModel.update(id, updateData)
  }
  static async deleteExecutor(id) {
    return await ExecutorModel.delete(id)
  }
}

export default ExecutorService
