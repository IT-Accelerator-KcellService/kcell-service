// backend/services/officeService.js
import OfficeModel from "../models/officeModel.js"

class OfficeService {
  static async getAllOffices() {
    return await OfficeModel.getAll()
  }

  static async getOfficeById(id) {
    return await OfficeModel.getById(id)
  }

  static async createOffice(officeData) {
    return await OfficeModel.create(officeData)
  }

  static async updateOffice(id, updateData) {
    return await OfficeModel.update(id, updateData)
  }

  static async deleteOffice(id) {
    return await OfficeModel.delete(id)
  }
}

export default OfficeService
