import { BadRequestError } from "../errors/errors.js";
import logger from "../utils/winston/logger.js";

export const validateId = (req) => {
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

export const validateBody = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (error) {
        logger.error(error);
        const details = Array.isArray(error.errors)
            ? error.errors.map((e) => ({
                field: Array.isArray(e.path) ? e.path.join('.') : 'unknown',
                message: e.message ?? 'Invalid input',
              }))
            : [{ field: 'unknown', message: 'Validation failed' }];

        return res.status(400).json({
            error: 'Validation error',
            details,
        });
    }
};
