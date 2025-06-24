import OfficeService from "../services/officeService.js"

class OfficeController {
  static async getAllOffices(req, res) {
    try {
      const offices = await OfficeService.getAllOffices()
      res.json(offices)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  static async getOfficeById(req, res) {
    try {
      const office = await OfficeService.getOfficeById(Number.parseInt(req.params.id))
      if (office) {
        res.json(office)
      } else {
        res.status(404).json({ message: "Office not found" })
      }
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  static async createOffice(req, res) {
    try {
      const newOffice = await OfficeService.createOffice(req.body)
      res.status(201).json(newOffice)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  static async updateOffice(req, res) {
    try {
      const updatedOffice = await OfficeService.updateOffice(Number.parseInt(req.params.id), req.body)
      if (updatedOffice) {
        res.json(updatedOffice)
      } else {
        res.status(404).json({ message: "Office not found" })
      }
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  static async deleteOffice(req, res) {
    try {
      const deleted = await OfficeService.deleteOffice(Number.parseInt(req.params.id))
      if (deleted) {
        res.status(204).send() // No Content
      } else {
        res.status(404).json({ message: "Office not found" })
      }
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

export default OfficeController
