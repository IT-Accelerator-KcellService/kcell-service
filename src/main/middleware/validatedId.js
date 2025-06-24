import { BadRequestError } from "../errors/errors.js";

export const validateId = (req, logger) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
        logger.warn('Invalid ID received', {
            endpoint: req.originalUrl,
            idParam: req.params.id,
        });
        throw new BadRequestError('Invalid ID received');
    }
    return id;
};