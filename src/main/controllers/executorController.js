import ExecutorService from "../services/executorService.js"

class ExecutorController {
  static async getAllExecutors(req, res) {
    try {
      const executors = await ExecutorService.getAllExecutors(req.user.id)
      res.json(executors)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
  static async getAverageRating(req, res) {
    try {

      const id  = req.user.id;
      const rating = await ExecutorService.getAverageRatingByExecutorId(id);

      res.json({ id, average_rating: rating.toFixed(2) });
    } catch (error) {
      console.error("Ошибка при получении средней оценки исполнителя:", error);
      res.status(500).json({ error: "Ошибка при получении средней оценки" });
    }
  }
  static async getExecutorById(req, res) {
    try {
      const executor = await ExecutorService.getExecutorById(Number.parseInt(req.params.id))
      if (executor) {
        res.json(executor)
      } else {
        res.status(404).json({ message: "Executor not found" })
      }
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  static async createExecutor(req, res) {
    try {
      const newExecutor = await ExecutorService.createExecutor(req.body)
      res.status(201).json(newExecutor)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  static async updateExecutor(req, res) {
    try {
      const updatedExecutor = await ExecutorService.updateExecutor(Number.parseInt(req.params.id), req.body)
      if (updatedExecutor) {
        res.json(updatedExecutor)
      } else {
        res.status(404).json({ message: "Executor not found" })
      }
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  static async deleteExecutor(req, res) {
    try {
      const deleted = await ExecutorService.deleteExecutor(Number.parseInt(req.params.id))
      if (deleted) {
        res.status(204).send()
      } else {
        res.status(404).json({ message: "Executor not found" })
      }
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

export default ExecutorController
