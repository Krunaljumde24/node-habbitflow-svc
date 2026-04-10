import express from 'express'
import { register } from '../service/authService.js';
export const authRouter = express.Router();


authRouter.get('/api/auth', (req, res, next) => {
    res.send('/api/auth - GET endpoint')
})


authRouter.post('/api/auth/register', async (req, res, next) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        res.status(400).json({
            error: "Invalid request details."
        })
    } else {
        const result = await register(email, name, password)
        res.status(result.status).json(result.response);
    }
})



