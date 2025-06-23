// backend/controllers/serviceCategoryController.js
import ServiceCategoryService from "../services/serviceCategoryService.js"

class ServiceCategoryController {
  static async getAllServiceCategories(req, res) {
    try {
      const categories = await ServiceCategoryService.getAllServiceCategories()
      res.json(categories)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  static async getServiceCategoryById(req, res) {
    try {
      const category = await ServiceCategoryService.getServiceCategoryById(Number.parseInt(req.params.id))
      if (category) {
        res.json(category)
      } else {
        res.status(404).json({ message: "Service category not found" })
      }
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  static async createServiceCategory(req, res) {
    try {
      const newCategory = await ServiceCategoryService.createServiceCategory(req.body)
      res.status(201).json(newCategory)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  static async updateServiceCategory(req, res) {
    try {
      const updatedCategory = await ServiceCategoryService.updateServiceCategory(
        Number.parseInt(req.params.id),
        req.body,
      )
      if (updatedCategory) {
        res.json(updatedCategory)
      } else {
        res.status(404).json({ message: "Service category not found" })
      }
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  static async deleteServiceCategory(req, res) {
    try {
      const deleted = await ServiceCategoryService.deleteServiceCategory(Number.parseInt(req.params.id))
      if (deleted) {
        res.status(204).send()
      } else {
        res.status(404).json({ message: "Service category not found" })
      }
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

export default ServiceCategoryController
