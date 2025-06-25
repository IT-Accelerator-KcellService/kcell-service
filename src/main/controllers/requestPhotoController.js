import RequestPhotoService from "../services/requestPhotoService.js"
import {asyncHandler} from "../middleware/asyncHandler.js";
import RequestService from "../services/requestService.js";

class RequestPhotoController {
  static async getAllRequestPhotos(req, res) {
    try {
      const photos = await RequestPhotoService.getAllRequestPhotos()
      res.json(photos)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  static async getRequestPhotoById(req, res) {
    try {
      const photo = await RequestPhotoService.getRequestPhotoById(Number.parseInt(req.params.id))
      if (photo) {
        res.json(photo)
      } else {
        res.status(404).json({ message: "Request photo not found" })
      }
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  static async createRequestPhoto(req, res) {
    try {
      const newPhoto = await RequestPhotoService.createRequestPhoto(req.body)
      res.status(201).json(newPhoto)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  static async updateRequestPhoto(req, res) {
    try {
      const updatedPhoto = await RequestPhotoService.updateRequestPhoto(Number.parseInt(req.params.id), req.body)
      if (updatedPhoto) {
        res.json(updatedPhoto)
      } else {
        res.status(404).json({ message: "Request photo not found" })
      }
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  static async deleteRequestPhoto(req, res) {
    try {
      const deleted = await RequestPhotoService.deleteRequestPhoto(Number.parseInt(req.params.id))
      if (deleted) {
        res.status(204).send()
      } else {
        res.status(404).json({ message: "Request photo not found" })
      }
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  static async getPhotosByRequestId(req, res) {
    try {
      const photos = await RequestPhotoService.getPhotosByRequestId(Number.parseInt(req.params.requestId))
      res.json(photos)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  static uploadPhotos = asyncHandler(async (req, res) => {
    const requestId = req.params.id
    const files = req.files
    const { type } = req.body

    const request = await RequestService.getRequestById(requestId)
    if (!request) {
      res.status(404).json({ message: "Request not found" })
    }
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "Нет файлов для загрузки" })
    }

    if (!type || !["before", "after"].includes(type)) {
      return res.status(400).json({ message: "Неверный тип фотографии (before/after)" })
    }

    const savedPhotos = []

    for (const file of files) {
      const photo = await RequestPhotoService.uploadRequestPhoto(file, requestId, type)
      savedPhotos.push(photo)
    }

    res.status(201).json({ message: "Фотографии загружены", photos: savedPhotos })
  })

}

export default RequestPhotoController
