import RequestService from "../services/requestService.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {NotFoundError} from "../errors/errors.js";

class RequestController {
  static getAllRequests = asyncHandler(async (req, res) => {
    const requests = await RequestService.getAllRequests();
    res.json(requests);
  });

  static getRequestById = asyncHandler(async (req, res) => {
    const request = await RequestService.getRequestById(Number.parseInt(req.params.id));
    if (request) {
      res.json(request);
    } else {
      res.status(404).json({ message: "Request not found" });
    }
  });
  static getRequestsByUser = asyncHandler(async (req, res) => {
    console.log(req.user);
    const userId = req.user.id;
    const request = await RequestService.getRequestsByUser(userId);
    if (request) {
      res.json(request);
    }else{
      throw new NotFoundError("Not Found");
    }
  })
  static createRequest = asyncHandler(async (req, res) => {
    const id = req.user.id;
    const newRequest = await RequestService.createRequest(id, req.body);
    res.status(201).json(newRequest);
  });

  static updateRequest = asyncHandler(async (req, res) => {
    const updatedRequest = await RequestService.updateRequest(Number.parseInt(req.params.id), req.body);
    if (updatedRequest) {
      res.json(updatedRequest);
    } else {
      res.status(404).json({ message: "Request not found" });
    }
  });

  static deleteRequest = asyncHandler(async (req, res) => {
    const deleted = await RequestService.deleteRequest(Number.parseInt(req.params.id));
    if (deleted) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: "Request not found" });
    }
  });

  static getAdminWorkerRequests = asyncHandler(async (req, res) => {
    const data = await RequestService.getAdminWorkerRequests(req.user.id);
    res.status(200).json(data);
  })
}

export default RequestController;
