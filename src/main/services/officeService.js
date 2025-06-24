// backend/services/officeService.js
import {Office} from "../models/init.js"

class OfficeService {
  static async getAllOffices() {
    return await Office.findAll()
  }

  static async getOfficeById(id) {
    return await Office.findByPk(id)
  }

  static async createOffice(officeData) {
    return await Office.create(officeData)
  }

  static async updateOffice(id, updateData) {
    return await Office.update(id, updateData)
  }

  static async deleteOffice(id) {
    return await Office.destroy(id)
  }
}

export default OfficeService
