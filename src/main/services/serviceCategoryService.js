import {ServiceCategory} from "../models/init.js"
import {NotFoundError} from "../errors/errors.js";

class ServiceCategoryService {

  static async getAllServiceCategories() {
    return await ServiceCategory.findAll()
  }

  static async getServiceCategoryById(id) {
    const serviceCategory = await ServiceCategory.findByPk(id)
    if (!serviceCategory) {
      throw new NotFoundError('Service category not found')
    }
    return serviceCategory
  }

  static async createServiceCategory(categoryData) {
    return await ServiceCategory.create(categoryData)
  }

  static async updateServiceCategory(id, updateData) {
    const updated = await ServiceCategory.update(id, updateData)
    if (!updated) {
      throw new NotFoundError('Service category not found')
    }
    return await ServiceCategory.findByPk(id)
  }

  static async deleteServiceCategory(id) {
    const deleted = await ServiceCategory.destroy(
        {
          where: {
            id: id
          }
        }
    )
    if (!deleted) {
      throw new NotFoundError('Service category not found')
    }
    return deleted
  }
}

export default ServiceCategoryService
