const express = require('express');
const pool = require('../config/db');
const requireAuth = require('../middleware/auth');

console.log('>>> completed.js file loaded');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, c.completed_at FROM completed_hikes c
       JOIN trails t ON t.id = c.trail_id
       WHERE c.user_id = $1`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching completed hikes' });
  }
});

router.post('/:trailId', requireAuth, async (req, res) => {
  try {
    await pool.query(
      'INSERT INTO completed_hikes (user_id, trail_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.userId, req.params.trailId]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error marking hike complete' });
  }
});

router.delete('/:trailId', requireAuth, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM completed_hikes WHERE user_id = $1 AND trail_id = $2',
      [req.userId, req.params.trailId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error removing completed hike' });
  }
});

module.exports = router;