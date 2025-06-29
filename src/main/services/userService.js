import {Executor, Office, User} from "../models/init.js"
import {ForbiddenError, NotFoundError} from "../errors/errors.js";
import {getHashedPassword} from "../utils/bcrypt/BCryptService.js";
import logger from "../utils/winston/logger.js";
import {sequelize} from "../config/database.js";

class UserService {
  static async getAllUsers() {
    return await User.findAll()
  }

  static async getUserById(id) {
    const user = await User.findByPk(id, {
      include: [
        {model: Office, as: "office"},
      ]
    })
    if (!user) {
      throw new NotFoundError(`User not found`)
    }
    return user
  }

  static async createUser(userData, user_role) {
    if (['client', 'department-head'].includes(userData.role)) {
      if (user_role !== 'admin-worker' || user_role !== 'manager') throw new ForbiddenError(`Forbidden`)
    } else if (['executor'].includes(userData.role)){
      if (user_role !== 'department-head') throw new ForbiddenError(`Forbidden`)
      const tx = await sequelize.transaction()
      try {
        const user = await User.create(userData, {transaction: tx});
        await Executor.create({
          user_id: user.id,
          specialty: userData.specialty,
          department_id: userData.department_id
        }, {transaction: tx});
        await tx.commit();
        return user
      } catch (err) {
        await tx.rollback();
        logger.error(`Error creating user: ${userData}`)
        throw err
      }
    }
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
