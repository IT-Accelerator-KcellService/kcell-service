import RequestService from "../services/requestService.js";
import {asyncHandler} from "../middleware/asyncHandler.js";
import {validateId} from "../middleware/validate.js";

class RequestController {
  static getAllRequests = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const result = await RequestService.getAllRequests(page, pageSize);
    res.json(result);
  });


  static getRequestById = asyncHandler(async (req, res) => {
    const id = validateId(req)
    const request = await RequestService.getRequestById(id);
    if (request) {
      res.json(request);
    } else {
      res.status(404).json({ message: "Request not found" });
    }
  });
  static getRequestsByUser = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const result = await RequestService.getRequestsByUser(userId, page, pageSize);

    res.json({
      total: result.count,
      page,
      pageSize,
      requests: result.rows
    });
  });

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
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Request not found" });
    }
  });

  static getAdminWorkerRequests = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const data = await RequestService.getAdminWorkerRequests(req.user.id, page, pageSize);
    res.status(200).json(data);
  });


  static updateRequestStatus = asyncHandler(async (req, res) => {
    const id = validateId(req);
    const data = await RequestService.updateRequestStatus(id, req.body);
    res.status(200).json(data);
  });

  static getDepartmentHeadRequests = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const data = await RequestService.getDepartmentHeadRequests(userId);
    res.status(200).json(data);
  });

  static assignExecutor = asyncHandler(async (req, res) => {
    const executorId = req.params.executor_id;
    const requestId = req.params.id;
    const userId = req.user.id;
    const data = await RequestService.assignExecutor(requestId, executorId, userId);
    res.status(200).json(data);
  });

  static getExecutorRequests = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const data = await RequestService.getExecutorRequests(userId);
    res.status(200).json(data);
  });

  static startRequest = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const requestId = req.params.id;
    const data = await RequestService.startRequest(requestId, userId)
    res.status(200).json(data);
  });

  static finishRequest = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const requestId = req.params.id;
    const comment = req.comment;
    const data = await RequestService.finishRequest(requestId, userId, comment)
    res.status(200).json(data);
  });
}

export default RequestController;
