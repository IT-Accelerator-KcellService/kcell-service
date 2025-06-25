import * as ratingService from "../services/requestRatingService.js";
import {asyncHandler} from "../middleware/asyncHandler.js";

export const createRequestRating = asyncHandler(async (req, res) => {
    const ratingData = req.body;
    const rating=ratingData.rating
    const id = req.user.id;
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Оценка должна быть от 1 до 5" });
    }

    const newRating = await ratingService.createRating({id, ratingData });
    res.status(201).json(newRating);
});

export const getAllRequestRatings = asyncHandler(async (req, res) => {
    const ratings = await ratingService.getAllRatings();
    res.json(ratings);
});

export const getRequestRatingById = asyncHandler(async (req, res) => {
    const rating = await ratingService.getRatingById(Number(req.params.id));
    if (!rating) {
        return res.status(404).json({ message: "Оценка не найдена" });
    }
    res.json(rating);
});

export const deleteRequestRating = asyncHandler(async (req, res) => {
    const deleted = await ratingService.deleteRating(Number(req.params.id));
    if (!deleted) {
        return res.status(404).json({ message: "Оценка не найдена для удаления" });
    }
    res.json({ message: "Оценка успешно удалена" });
});
