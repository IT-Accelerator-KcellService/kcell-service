import {User} from "../models/init.js"

class UserService {
  static async getAllUsers() {
    return await User.findAll()
  }

  static async getUserById(id) {
    return await User.findByPk(id)
  }

  static async createUser(userData) {
    return await User.create(userData)
  }

  static async updateUser(id, updateData) {
    return await User.update(id, updateData)
  }

  static async deleteUser(id) {
    return await User.destroy(id)
  }
}

export default UserService
