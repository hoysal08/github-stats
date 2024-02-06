import express from 'express';
import github from '../github';

const router = express.Router();

router.route('/:username').get(async (req, res) => {
    const username = req.params.username;
    const stats = await github.retriveStreakStats(username);
    res.status(200).json(stats);
})

export default router;