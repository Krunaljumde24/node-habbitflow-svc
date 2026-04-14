import jwt from "jsonwebtoken"

const jwtSecret = process.env.JWT_SECRET;
const jwtExpiry = process.env.JWT_EXPIRY;

export const generateToken = (userData) => {
    return jwt.sign(userData, jwtSecret, {
        algorithm: "HS256",
        expiresIn: jwtExpiry
    })
}

export const verifyToken = (token) => {
    try {
        const result = jwt.verify(token, jwtSecret);
        return {
            status: 200,
            response: {
                message: 'Valid token found.',
                data: result
            }
        }
    } catch (error) {
        console.log(error.message);
        return {
            status: 401,
            response: {
                error: error.message,
            }
        }
    }
}