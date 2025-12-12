const express = require('express');
const router = express.Router();

const { generateVariants } = require('../utils/promptGen');
const { analyze } = require('../services/analysisService');
const Experiment = require('../models/Experiment');


// Temporary LLM mock
function mockLLMResponse(prompt) {
  return `Mocked reply for: "${prompt.slice(0, 140)}"`;
}

router.post('/run', async (req, res) => {
  try {
    const { basePrompt, variables } = req.body || {};
    if (!basePrompt) {
      return res.status(400).json({ error: "basePrompt required" });
    }

    const prompts = generateVariants(basePrompt, variables);
    const variants = [];

    for (let i = 0; i < prompts.length; i++) {
      const prompt = prompts[i];
      const responseText = mockLLMResponse(prompt);

      const metrics = analyze(responseText);

      variants.push({
        id: `v${i+1}`,
        prompt,
        response: responseText,
        metrics
      });
    }

    let saved = null;
    try {
      const doc = new Experiment({
        basePrompt,
        variables: variables || {},
        variants
      });
      saved = await doc.save();
    } catch (err) {
      console.warn("⚠ Mongo save failed (but not fatal):", err.message);
    }

    res.json({
      ok: true,
      experimentId: saved ? saved._id : null,
      variants
    });
  } catch (err) {
    console.error("Error in /run:", err);
    res.status(500).json({ error: "server error" });
  }
});

// GET /api/experiments  → return latest saved experiments
router.get("/", async (req, res) => {
  try {
    const experiments = await Experiment.find()
      .sort({ createdAt: -1 })
      .limit(20); // don’t dump entire DB

    res.json({ ok: true, experiments });
  } catch (err) {
    console.error("Error fetching experiments:", err);
    res.status(500).json({ ok: false, error: "server error" });
  }
});

module.exports = router;
