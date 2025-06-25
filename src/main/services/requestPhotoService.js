import fs from "fs/promises";
import {v2 as cloudinary} from "cloudinary"
import {RequestPhoto} from "../models/RequestPhoto.js"
import {NotFoundError} from "../errors/errors.js";

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
    const photo = await RequestPhoto.findByPk(id)
    if (!photo) {
      throw new NotFoundError('Photo not found')
    }
    return photo
  }
  static async createRequestPhoto(photoData) {
    return await RequestPhoto.create(photoData)
  }
  static async updateRequestPhoto(id, updateData) {
    const photo = await RequestPhoto.update(id, updateData)
    if (!photo) {
      throw new NotFoundError('Request photo not found')
    }
    return await RequestPhoto.findByPk(id)
  }
  static async deleteRequestPhoto(id) {
    const photo = await RequestPhoto.destroy(id)
    if (!photo) {
      throw new NotFoundError('Request photo not found')
    }
    return photo
  }
  static async getPhotosByRequestId(requestId) {
    const photos = await RequestPhoto.findAll({ where: { request_id: requestId } })
    if (!photos) {
      throw new NotFoundError('Request photo not found')
    }
    return photos
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
