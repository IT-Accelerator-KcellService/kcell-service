import logger from '../utils/winston/logger.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
        logger.warn({
            message: 'Нет токена авторизации.',
            endpoint: req.originalUrl,
            userId: null,
            requestId: null
        });
        return res.status(401).json({ message: 'Нет токена авторизации.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log('JWT error:', err.name, err.message);
            logger.warn({
                message: 'Неверный токен.',
                endpoint: req.originalUrl,
                userId: null,
                requestId: null,
                error: err.stack
            });
            return res.status(401).json({ message: 'Неверный токен.' });
        }
        req.user = user;
        next();
    });
};
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;

        if (!allowedRoles.includes(userRole)) {
            logger.warn({
                message: `Доступ запрещён для роли ${userRole}. Разрешены: ${allowedRoles.join(', ')}`,
                endpoint: req.originalUrl,
                userId: req.user?.id || null,
                requestId: req.requestId || null
            });
            return res.status(403).json({ message: 'Доступ запрещён.' });
        }

        next();
    };
};



export  { authenticateToken, authorizeRoles}
