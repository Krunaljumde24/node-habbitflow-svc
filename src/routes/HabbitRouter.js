import express from 'express'
import { getAllHabbits, getHabbitById, getLogDetailsByUserId, saveHabbit, toggleHabbitStatus } from '../service/HabbitService.js';

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

HabbitRouter.get('/api/habbits/:id', async (req, res) => {
    const params = req.params;
    const id = Number(params['id']);
    if (id && typeof (id) === 'number') {
        try {
            getHabbitById(id)
            res.status(200).send('Ok')
        } catch (error) {
            console.log('Failed to retreive habbits data.');
            console.log(error);
            res.status(500).json({
                error: "Something went wrong."
            })
        }
    } else {
        res.status(400).json({
            error: "Invalid request details."
        });
    }
});

HabbitRouter.post('/api/habbits', async (req, res) => {
    if (req.body?.userId === undefined || req.body?.data === undefined) {
        res.status(400).json({
            error: "Invalid request details."
        });
    } else {
        const result = await saveHabbit(userId, data)
        res.status(result.status).json(result.response);
    }
})


HabbitRouter.post('/api/habbits/log', async (req, res) => {
    const { hId, uId, logDate, note, status } = req.body;
    if (!uId || !hId || !status) {
        res.status(400).json({
            error: "Invalid request details."
        });
    } else {
        const result = await toggleHabbitStatus(hId, uId, logDate, note, status)
        console.log(result);
        res.status(result.status).json(result.response)
    }
})

HabbitRouter.get('/api/habbits/log/:userId', async (req, res) => {
    const { userId } = req.params;
    if (userId === undefined) {
        res.status(400).json({
            error: "Invalid request details."
        });
    } else {
        const result = await getLogDetailsByUserId(userId);
        res.status(result.status).json(result.response);
    }
})