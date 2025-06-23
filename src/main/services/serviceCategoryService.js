// backend/services/serviceCategoryService.js
import ServiceCategoryModel from "../models/serviceCategoryModel.js"

class ServiceCategoryService {
  static async getAllServiceCategories() {
    return await ServiceCategoryModel.getAll()
  }
  static async getServiceCategoryById(id) {
    return await ServiceCategoryModel.getById(id)
  }
  static async createServiceCategory(categoryData) {
    return await ServiceCategoryModel.create(categoryData)
  }
  static async updateServiceCategory(id, updateData) {
    return await ServiceCategoryModel.update(id, updateData)
  }
  static async deleteServiceCategory(id) {
    return await ServiceCategoryModel.delete(id)
  }
}

export default ServiceCategoryService
