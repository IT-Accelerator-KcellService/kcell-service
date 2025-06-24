import {asyncHandler} from "../middleware/asyncHandler.js";
import UserService from "../services/userService.js"
import {validateId} from "../middleware/validate.js";

class UserController {
  static getAllUsers = asyncHandler(async (req, res) => {
    const users = await UserService.getAllUsers();
    res.json(users);
  });

  static getUserById = asyncHandler(async (req, res) => {
    const id = validateId(req.params.id);
    const user = await UserService.getUserById(id);
    res.json(user);
  });

  static createUser = asyncHandler(async (req, res) => {
    const newUser = await UserService.createUser(req.body);
    res.status(201).json(newUser);
  });

  static updateUser = asyncHandler(async (req, res) => {
    const id = validateId(req.params.id);
    const updatedUser = await UserService.updateUser(id, req.body);
    res.json(updatedUser);
  });

  static deleteUser = asyncHandler(async (req, res) => {
    const id = validateId(req.params.id);
    await UserService.deleteUser(id);
    res.status(204).send();
  });
}

export default UserController
