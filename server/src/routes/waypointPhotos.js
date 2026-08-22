const express = require('express');
const pool = require('../config/db');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// Get current user's photos for all waypoints on a trail
router.get('/trail/:trailId', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT wp.waypoint_id, wp.image_data
       FROM waypoint_photos wp
       JOIN waypoints w ON w.id = wp.waypoint_id
       WHERE wp.user_id = $1 AND w.trail_id = $2`,
      [req.userId, req.params.trailId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching photos' });
  }
});

// Upload or replace a photo for a waypoint
router.post('/:waypointId', requireAuth, async (req, res) => {
  try {
    const { imageData } = req.body;
    if (!imageData) {
      return res.status(400).json({ error: 'imageData is required' });
    }
    if (imageData.length > 2_000_000) {
      return res.status(400).json({ error: 'Image too large' });
    }

    await pool.query(
      `INSERT INTO waypoint_photos (user_id, waypoint_id, image_data)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, waypoint_id)
       DO UPDATE SET image_data = $3, uploaded_at = NOW()`,
      [req.userId, req.params.waypointId, imageData]
    );
    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error uploading photo' });
  }
});

// Remove a photo
router.delete('/:waypointId', requireAuth, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM waypoint_photos WHERE user_id = $1 AND waypoint_id = $2',
      [req.userId, req.params.waypointId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error removing photo' });
  }
});

module.exports = router;