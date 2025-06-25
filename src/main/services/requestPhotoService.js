import fs from "fs/promises";
import {v2 as cloudinary} from "cloudinary"
import {RequestPhoto} from "../models/RequestPhoto.js"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})


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

  static async uploadRequestPhoto(file, requestId, type) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "request_photos",
    })

    await fs.unlink(file.path)

    const photo = await RequestPhoto.create({
      request_id: requestId,
      photo_url: result.secure_url,
      type,
    })

    return photo
  }
}

export default RequestPhotoService
