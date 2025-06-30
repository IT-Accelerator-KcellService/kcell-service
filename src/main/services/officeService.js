import {Office} from "../models/init.js"
import {NotFoundError} from "../errors/errors.js";

class OfficeService {
  static async getAllOffices() {
    return await Office.findAll()
  }

  static async getOfficeById(id) {
    const office = await Office.findByPk(id)
    if (!office) {
      throw new NotFoundError('No Office with id ' + id);
    }
    return office
  }

  static async createOffice(officeData) {
    return await Office.create(officeData)
  }

  static async updateOffice(id, updateData) {
    const updatedOffice = await Office.update(updateData, {
      where: {id: id}
    })
    if (!updatedOffice) {
      throw new NotFoundError('No Office with id ' + id);
    }
    return await Office.findByPk(id)
  }

  static async deleteOffice(id) {
    const deleted = await Office.destroy({
      where: {id: id}
    })
    if (!deleted) {
      throw new NotFoundError('No Office with id ' + id);
    }
    return deleted
  }
}

export default OfficeService
