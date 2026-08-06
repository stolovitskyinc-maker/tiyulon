const express = require('express');
const pool = require('../config/db');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// Get current user's favorites
router.get('/', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.* FROM favorites f
       JOIN trails t ON t.id = f.trail_id
       WHERE f.user_id = $1`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching favorites' });
  }
});

// Add a favorite
router.post('/:trailId', requireAuth, async (req, res) => {
  try {
    await pool.query(
      'INSERT INTO favorites (user_id, trail_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.userId, req.params.trailId]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error adding favorite' });
  }
});

// Remove a favorite
router.delete('/:trailId', requireAuth, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND trail_id = $2',
      [req.userId, req.params.trailId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error removing favorite' });
  }
});

module.exports = router;