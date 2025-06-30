import {RequestRating,Request} from "../models/init.js";
import {Op} from "sequelize";
import ExecutorService from "../services/executorService.js"
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
export const getRatingsByExecutor = async (userId) => {
    const executor = await ExecutorService.getExecutorByUserId(userId)
    if (!executor) return []

    const requests = await Request.findAll({
        where: {
            executor_id: executor.id,
            status: 'completed'
        },
        attributes: ['id']
    })

    const requestIds = requests.map(req => req.id)
    if (requestIds.length === 0) return []

    const ratings = await RequestRating.findAll({
        where: {
            request_id: {
                [Op.in]: requestIds
            }
        },
        attributes: [
            'request_id',
            [RequestRating.sequelize.fn('AVG', RequestRating.sequelize.col('rating')), 'average_rating']
        ],
        group: ['request_id'],
        raw: true
    })

    return ratings.map(r => ({
        request_id: r.request_id,
        rating: parseFloat(r.average_rating).toFixed(0)
    }))
}

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
