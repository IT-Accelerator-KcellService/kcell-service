import {User} from "../models/init.js"
import {NotFoundError} from "../errors/errors.js";
import {getHashedPassword} from "../utils/bcrypt/BCryptService.js";

class UserService {
  static async getAllUsers() {
    return await User.findAll()
  }

  static async getUserById(id) {
    const user = await User.findByPk(id)
    if (!user) {
      throw new NotFoundError(`User not found`)
    }
    return user
  }

  static async createUser(userData) {
    userData.password = await getHashedPassword(userData.password);
    return await User.create(userData)
  }

  static async updateUser(id, updateData) {
    const updatedUser = await User.update(id, updateData)
    if (!updatedUser) {
      throw new NotFoundError(`User not found`)
    }
    return await User.findByPk(id)
  }

  static async deleteUser(id) {
    const deletedUser = await User.destroy(id)
    if (!deletedUser) {
      throw new NotFoundError(`User not found`)
    }
    return deletedUser
  }
}

export default UserService
