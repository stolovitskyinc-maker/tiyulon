const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// GET all trails (empty until we seed data on Day 5)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM trails');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching trails' });
  }
});

module.exports = router;