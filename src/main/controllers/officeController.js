import OfficeService from "../services/officeService.js"
import {asyncHandler} from "../middleware/asyncHandler.js";

class OfficeController {
  static getAllOffices = asyncHandler(async (req, res) => {
    const offices = await OfficeService.getAllOffices()
    res.json(offices)
  });

  static getOfficeById = asyncHandler(async (req, res) => {
    const id = req.params.id
    const office = await OfficeService.getOfficeById(id)
    res.json(office)
  });

  static createOffice = asyncHandler(async (req, res) => {
    const newOffice = await OfficeService.createOffice(req.body)
    res.status(201).json(newOffice)
  });

  static updateOffice = asyncHandler(async (req, res) => {
    const id = req.params.id
    const updatedOffice = await OfficeService.updateOffice(id, req.body)
    res.json(updatedOffice)
  });

  static deleteOffice = asyncHandler(async (req, res) => {
    const id = req.params.id
    await OfficeService.deleteOffice(id)
    res.status(204).send()
  });
}

export default OfficeController
