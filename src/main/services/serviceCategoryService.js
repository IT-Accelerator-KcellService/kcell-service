import {ServiceCategory} from "../models/init.js"

class ServiceCategoryService {
  static async getAllServiceCategories() {
    return await ServiceCategory.findAll()
  }
  static async getServiceCategoryById(id) {
    return await ServiceCategory.findByPk(id)
  }
  static async createServiceCategory(categoryData) {
    return await ServiceCategory.create(categoryData)
  }
  static async updateServiceCategory(id, updateData) {
    return await ServiceCategory.update(id, updateData)
  }
  static async deleteServiceCategory(id) {
    return await ServiceCategory.destroy(id)
  }
}

export default ServiceCategoryService
