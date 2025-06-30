import {Executor, Office, User} from "../models/init.js"
import {ForbiddenError, NotFoundError} from "../errors/errors.js";
import {getHashedPassword, randomString} from "../utils/bcrypt/BCryptService.js";
import logger from "../utils/winston/logger.js";
import {sequelize} from "../config/database.js";
import NotificationService from "./notificationService.js";

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

  static async createUser(id, userData, user_role) {
    const currentUser = await UserService.getUserById(id);

    if (['client', 'department-head', 'manager', 'admin-worker'].includes(userData.role)) {
      if (user_role !== 'manager') {
        throw new ForbiddenError('Forbidden');
      }
      const tx = await sequelize.transaction();
      try {
        // Генерация и хэширование пароля
        const rawPassword = randomString(10);
        const hashedPassword = await getHashedPassword(rawPassword);

        const newUser = await User.create({
          ...userData,
          office_id: userData.office_id,
          password: hashedPassword
        }, {transaction: tx});

        await tx.commit();

        await NotificationService.sendPasswordNotification({
          userId: newUser.id,
          rawPassword
        });
        return "Successfully created";
      } catch (err) {
        await tx.rollback();
        logger.error(`Error creating user: ${JSON.stringify(userData)} — ${err.message}`);
        throw err;
      }

    } else if (userData.role === 'executor') {
      if (user_role !== 'department-head') {
        throw new ForbiddenError('Forbidden');
      }

      const tx = await sequelize.transaction();
      try {
        // Генерация и хэширование пароля
        const rawPassword = randomString(10);
        const hashedPassword = await getHashedPassword(rawPassword);

        const newUser = await User.create({
          ...userData,
          office_id: currentUser.office_id,
          password: hashedPassword
        }, {transaction: tx});

        await Executor.create({
          user_id: newUser.id,
          specialty: userData.specialty,
          department_id: id
        }, {transaction: tx});

        await tx.commit();

        await NotificationService.sendPasswordNotification({
          userId: newUser.id,
          rawPassword
        });
        return "Successfully created";
      } catch (err) {
        await tx.rollback();
        logger.error(`Error creating user: ${JSON.stringify(userData)} — ${err.message}`);
        throw err;
      }
    }
  }

  static async updateUser(id, updateData) {
    const updatedUser = await User.update(id, updateData)
    if (!updatedUser) {
      throw new NotFoundError(`User not found`)
    }
    return await User.findByPk(id)
  }

  static async deleteUser(id) {
    const deletedUser = await User.destroy({
      where: {id: id}
    })
    if (!deletedUser) {
      throw new NotFoundError(`User not found`)
    }
    return deletedUser
  }
}

export default UserService
