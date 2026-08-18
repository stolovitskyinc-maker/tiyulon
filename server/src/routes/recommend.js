const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const pool = require('../config/db');

const router = express.Router();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const trailsResult = await pool.query(
      'SELECT id, name, difficulty, estimated_time, shade_level, water_sources, description FROM trails'
    );
    const trails = trailsResult.rows;

    const trailSummaries = trails
      .map(t => `- ID ${t.id}: "${t.name}" — Difficulty: ${t.difficulty}, Time: ${t.estimated_time}, Shade: ${t.shade_level}, Water: ${t.water_sources ? 'Yes' : 'No'}. ${t.description}`)
      .join('\n');

    const systemPrompt = `You are a friendly trail-matching assistant for Tiyulon, a family hiking app for Israel. Your job is to help the user pick ONE of the following trails, based on a short conversation:

${trailSummaries}

Rules:
- Ask at most 2 short, simple clarifying questions (e.g. how much time they have, whether they're with young kids, whether they prefer nature or history) — one question at a time, not a list.
- Only use the trail information given above. Never invent details or discuss trails not listed here.
- Once you have enough information, recommend exactly ONE trail. End your final message with this exact marker on its own line: [[RECOMMEND:ID]] where ID is that trail's numeric ID from the list above.
- Do not show the marker format to the user in any other way, and only include it once you are making your final recommendation, not during clarifying questions.`;

    const claudeMessages = messages.map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    }));

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 300,
      system: systemPrompt,
      messages: claudeMessages,
    });

    let reply = response.content[0].text;
    let recommendedTrailId = null;

    const match = reply.match(/\[\[RECOMMEND:(\d+)\]\]/);
    if (match) {
      recommendedTrailId = parseInt(match[1], 10);
      reply = reply.replace(/\[\[RECOMMEND:\d+\]\]/, '').trim();
    }

    res.json({ reply, recommendedTrailId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during recommendation' });
  }
});

module.exports = router;