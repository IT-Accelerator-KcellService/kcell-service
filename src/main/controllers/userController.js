import {asyncHandler} from "../middleware/asyncHandler.js";
import UserService from "../services/userService.js"

class UserController {
  static getAllUsers = asyncHandler(async (req, res) => {
    const users = await UserService.getAllUsers();
    res.json(users);
  });

  static getUserById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const user = await UserService.getUserById(id);
    res.json(user);
  });
  static getUserMe = asyncHandler(async (req, res) => {
    const id = req.user.id;
    const user = await UserService.getUserById(id);
    res.json(user);
  });
  static changePassword = asyncHandler(async (req, res) => {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Все поля обязательны' });
      }
      const result = await UserService.changePassword(userId, currentPassword, newPassword);
      res.json(result);
  });
  static createUser = asyncHandler(async (req, res) => {
    const id = req.user.id;
    const newUser = await UserService.createUser(id,req.body, req.user.role);
    res.status(201).json(newUser);
  });

  static updateUser = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const updatedUser = await UserService.updateUser(id, req.body);
    res.json(updatedUser);
  });

  static deleteUser = asyncHandler(async (req, res) => {
    const id = req.params.id;
    await UserService.deleteUser(id);
    res.status(204).send();
  });
}

export default UserController
