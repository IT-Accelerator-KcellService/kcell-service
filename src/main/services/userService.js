// backend/services/userService.js
import UserModel from "../models/userModel.js"

class UserService {
  static async getAllUsers() {
    return await UserModel.getAll()
  }

  static async getUserById(id) {
    return await UserModel.getById(id)
  }

  static async createUser(userData) {
    return await UserModel.create(userData)
  }

  static async updateUser(id, updateData) {
    return await UserModel.update(id, updateData)
  }

  static async deleteUser(id) {
    return await UserModel.delete(id)
  }
}

export default UserService
