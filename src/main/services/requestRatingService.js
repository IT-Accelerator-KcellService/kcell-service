import { RequestRating } from "../models/requestRating.js";

export const createRating = async (id,ratingData) => {
    return await RequestRating.create({
            rated_by: id,
        ...ratingData
    }
    );
};

export const getAllRatings = async () => {
    return await RequestRating.findAll();
};

export const getRatingById = async (id) => {
    return await RequestRating.findByPk(id);
};

export const deleteRating = async (id) => {
    const rating = await RequestRating.findByPk(id);
    if (!rating) return null;
    await rating.destroy();
    return rating;
};
