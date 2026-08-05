const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// GET all trails
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM trails');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching trails' });
  }
});

// GET single trail by id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM trails WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Trail not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching trail' });
  }
});

// GET waypoints for a trail
router.get('/:id/waypoints', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM waypoints WHERE trail_id = $1 ORDER BY order_on_trail ASC',
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching waypoints' });
  }
});

module.exports = router;