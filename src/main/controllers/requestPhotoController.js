import RequestPhotoService from "../services/requestPhotoService.js"
import {asyncHandler} from "../middleware/asyncHandler.js";
import RequestService from "../services/requestService.js";

class RequestPhotoController {
  static getAllRequestPhotos = asyncHandler(async (req, res) => {
      const photos = await RequestPhotoService.getAllRequestPhotos()
      res.json(photos)
  })

  static getRequestPhotoById = asyncHandler(async (req, res) => {
    const photo = await RequestPhotoService.getRequestPhotoById(Number.parseInt(req.params.id))
    res.json(photo)
  })

  static createRequestPhoto = asyncHandler(async (req, res) => {
    const newPhoto = await RequestPhotoService.createRequestPhoto(req.body)
    res.status(201).json(newPhoto)
  })

  static updateRequestPhoto = asyncHandler(async (req, res) => {
    const updatedPhoto = await RequestPhotoService.updateRequestPhoto(Number.parseInt(req.params.id), req.body)
    res.json(updatedPhoto)
  })

  static deleteRequestPhoto = asyncHandler(async (req, res) => {
    await RequestPhotoService.deleteRequestPhoto(Number.parseInt(req.params.id))
    res.status(204).send()
  })

  static getPhotosByRequestId = asyncHandler(async (req, res) => {
    const photos = await RequestPhotoService.getPhotosByRequestId(Number.parseInt(req.params.requestId))
    res.json(photos)
  })

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
