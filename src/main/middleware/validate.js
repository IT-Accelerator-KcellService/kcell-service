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

export const validateBody = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            error: 'Validation error',
            details: error.errors.map((e) => ({
                field: e.path.join('.'),
                message: e.message,
            })),
        });
    }
};
