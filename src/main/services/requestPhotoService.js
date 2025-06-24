import {RequestPhoto} from "../models/init.js"

class RequestPhotoService {
  static async getAllRequestPhotos() {
    return await RequestPhoto.findAll()
  }
  static async getRequestPhotoById(id) {
    return await RequestPhoto.findByPk(id)
  }
  static async createRequestPhoto(photoData) {
    return await RequestPhoto.create(photoData)
  }
  static async updateRequestPhoto(id, updateData) {
    return await RequestPhoto.update(id, updateData)
  }
  static async deleteRequestPhoto(id) {
    return await RequestPhoto.destroy(id)
  }
  static async getPhotosByRequestId(requestId) {
    return await RequestPhoto.getByRequestId(requestId)
  }
}

export default RequestPhotoService
