import {RequestRating} from "../models/init.js";

export const createRating = async (rated_by,request_id,rating) => {
    const existing = await RequestRating.findOne({
        where: { request_id, rated_by }
    });

    if (existing) {
        throw new Error("Вы уже оценили этот запрос.");
    }
    return await RequestRating.create({
            rated_by,
            request_id,
        rating
    }
    );
};

export const getAllRatings = async () => {
    return await RequestRating.findAll();
};
export const  getRatingsByUser= async (userId,id)=> {
    return await RequestRating.findAll({
        where: {
            rated_by: userId,
            request_id: id
        }
    });
}
export const getRatingById = async (id) => {
    return await RequestRating.findByPk(id);
};

export const deleteRating = async (id) => {
    const rating = await RequestRating.findByPk(id);
    if (!rating) return null;
    await rating.destroy();
    return rating;
};
