import express from 'express';
import github from '../github';
import logger from '../utils/logger';

const router = express.Router();

router.route('/:username').get(async (req, res) => {
    const username = req.params.username;
    logger.info(`Fetching stats for ${username}`);
    console.log(`Fetching stats for ${username}`);
    const stats = await github.getStreakStats(username);
    res.status(200).json(stats);
})

export default router;