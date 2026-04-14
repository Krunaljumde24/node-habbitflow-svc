import express from 'express'
import { login, register } from '../service/authService.js';
import { verifyToken } from '../utils/JwtUtil.js';
export const authRouter = express.Router();

authRouter.get('/api/auth', (req, res, next) => {
    res.send('/api/auth - GET endpoint')
})


authRouter.post('/api/auth/register', async (req, res, next) => {
    const { email, name, password } = req.body;
    if (!email?.trim() || !name?.trim() || !password?.trim()) {
        res.status(400).json({
            error: "Invalid request details."
        })
    } else {
        const result = await register(email, name, password)
        res.status(result.status).json(result.response);
    }
})

authRouter.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email?.trim() || !password?.trim()) {
        res.status(400).json({
            error: "Invalid request details."
        })
    } else {
        const result = await login(email, password)
        res.status(result.status).json(result.response);
    }
}
);

authRouter.get('/api/auth/verify', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (authHeader?.trim().length > 0 && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const result = verifyToken(token)
        res.status(result.status).json(result.response)
    } else {
        res.status(401).json({
            error: 'Invalid or expired token'
        })
    }
})



