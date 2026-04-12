import express from 'express'
import { getAllHabbits } from '../service/HabbitService.js';

export const HabbitRouter = express.Router();

HabbitRouter.get('/api/habbits', async (req, res) => {
    const { userId } = req.query;
    try {
        const result = await getAllHabbits(userId)
        res.status(200).json(result)
    } catch (error) {
        console.log('Failed to retreive habbits data.');
        res.status(500).json({
            error: "Something went wrong."
        })
    }
})


