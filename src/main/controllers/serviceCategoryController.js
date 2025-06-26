import ServiceCategoryService from "../services/serviceCategoryService.js"
import {asyncHandler} from "../middleware/asyncHandler.js";

class ServiceCategoryController {
  static getAllServiceCategories = asyncHandler(async (req, res) => {
    const categories = await ServiceCategoryService.getAllServiceCategories()
    res.json(categories)
  })

  static getServiceCategoryById = asyncHandler(async (req, res) => {
    const id = req.params.id
    const category = await ServiceCategoryService.getServiceCategoryById(id);
    res.json(category);
  });

  static createServiceCategory = asyncHandler(async (req, res) => {
    const newCategory = await ServiceCategoryService.createServiceCategory(req.body);
    res.status(201).json(newCategory);
  });

  static updateServiceCategory = asyncHandler(async (req, res) => {

    const id = req.params.id
    const updatedCategory = await ServiceCategoryService.updateServiceCategory(id, req.body);
    res.json(updatedCategory);
  });

  static deleteServiceCategory = asyncHandler(async (req, res) => {
    const id = req.params.id
    await ServiceCategoryService.deleteServiceCategory(id);
    res.status(204).send();
  });
}

export default ServiceCategoryController
