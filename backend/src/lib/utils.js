import jwt from 'jsonwebtoken';

export const generateToken = (userID, res) => {
    // Generate the token with the payload and expiration
    const token = jwt.sign({ userId: userID }, process.env.JWT_SECRET, {
        expiresIn: '7d', // Token expiration set to 7 days
    });

    // Set the token as a cookie
    res.cookie('jwt', token, {
        httpOnly: true, // Ensures cookie can't be accessed via JavaScript
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        sameSite: 'strict', // CSRF protection
        secure: process.env.NODE_ENV === 'production', // Cookie is only sent over HTTPS in production
    });

    return token;
};
