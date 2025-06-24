import RequestPhotoService from "../services/requestPhotoService.js"

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
}

export default RequestPhotoController
