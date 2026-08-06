const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const pool = require('../config/db');

const router = express.Router();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

router.post('/:trailId/chat', async (req, res) => {
  try {
    const { trailId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const trailResult = await pool.query('SELECT * FROM trails WHERE id = $1', [trailId]);
    if (trailResult.rows.length === 0) {
      return res.status(404).json({ error: 'Trail not found' });
    }
    const trail = trailResult.rows[0];

    const waypointsResult = await pool.query(
      'SELECT name, story_text FROM waypoints WHERE trail_id = $1 ORDER BY order_on_trail ASC',
      [trailId]
    );
    const waypoints = waypointsResult.rows;

    const waypointText = waypoints
      .map(wp => `- ${wp.name}: ${wp.story_text}`)
      .join('\n');

    const systemPrompt = `You are a friendly trail guide assistant for the trail "${trail.name}" in Tiyulon, a family hiking app for Israel.

Trail info:
- Region: ${trail.region}
- Difficulty: ${trail.difficulty}
- Estimated time: ${trail.estimated_time}
- Shade: ${trail.shade_level}
- Water sources available: ${trail.water_sources ? 'Yes' : 'No'}
- Description: ${trail.description}

Waypoints along this trail:
${waypointText}

Flora and fauna on this trail:
${trail.flora_fauna || 'No specific flora/fauna information available for this trail.'}

Extended history:
${trail.extended_history || 'No additional historical information available for this trail.'}

Rules:
- Only answer using the information provided above about this trail.
- If asked something not covered by this data (e.g. live conditions, weather, whether the trail is open today), clearly say you don't have that information rather than guessing.
- Keep answers friendly, concise, and suitable for a family audience.
- Do not discuss other trails not listed here.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 500,
      system: systemPrompt,
      messages: [{ role: 'user', content: message }],
    });

    const reply = response.content[0].text;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during chat' });
  }
});

module.exports = router;