import jwt from 'jsonwebtoken';

const JWT_SECRET =  process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_SECRET_EXPIRATION || '7d';

export const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        {expiresIn: JWT_EXPIRES_IN,}
    );
};
export const setTokenCookie=(res, token) =>{
    res.cookie('token', token, {
        httpOnly: false,
        secure: false,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
}
