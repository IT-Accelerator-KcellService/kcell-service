// backend/services/requestPhotoService.js
import RequestPhotoModel from "../models/requestPhotoModel.js"

class RequestPhotoService {
  static async getAllRequestPhotos() {
    return await RequestPhotoModel.getAll()
  }
  static async getRequestPhotoById(id) {
    return await RequestPhotoModel.getById(id)
  }
  static async createRequestPhoto(photoData) {
    return await RequestPhotoModel.create(photoData)
  }
  static async updateRequestPhoto(id, updateData) {
    return await RequestPhotoModel.update(id, updateData)
  }
  static async deleteRequestPhoto(id) {
    return await RequestPhotoModel.delete(id)
  }
  static async getPhotosByRequestId(requestId) {
    return await RequestPhotoModel.getByRequestId(requestId)
  }
}

export default RequestPhotoService
