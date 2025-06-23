// backend/controllers/userController.js
import UserService from "../services/userService.js"

class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers()
      res.json(users)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  static async getUserById(req, res) {
    try {
      const user = await UserService.getUserById(Number.parseInt(req.params.id))
      if (user) {
        res.json(user)
      } else {
        res.status(404).json({ message: "User not found" })
      }
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  static async createUser(req, res) {
    try {
      const newUser = await UserService.createUser(req.body)
      res.status(201).json(newUser)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  static async updateUser(req, res) {
    try {
      const updatedUser = await UserService.updateUser(Number.parseInt(req.params.id), req.body)
      if (updatedUser) {
        res.json(updatedUser)
      } else {
        res.status(404).json({ message: "User not found" })
      }
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  static async deleteUser(req, res) {
    try {
      const deleted = await UserService.deleteUser(Number.parseInt(req.params.id))
      if (deleted) {
        res.status(204).send() // No Content
      } else {
        res.status(404).json({ message: "User not found" })
      }
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

export default UserController
