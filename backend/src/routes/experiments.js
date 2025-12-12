// src/routes/experiments.js
const express = require('express');
const router = express.Router();

const { generateVariants } = require('../utils/promptGen');
const { analyze } = require('../services/analysisService');
const Experiment = require('../models/Experiment');

// Optional LLM service (Gemini). If you implemented it, use it.
// If it's missing, we'll gracefully fall back to a local mock.
let runLLM = null;
try {
  // require may throw if the file doesn't exist or exports differently
  const llm = require('../services/llmService');
  runLLM = llm.runLLM || llm.default || null;
} catch (err) {
  // no llm service present — that's fine
  runLLM = null;
}

/* small local fallback LLM that produces short mocked replies */
function mockLLMResponse(prompt) {
  // keep it readable and short for UI
  return `Mocked reply for: "${String(prompt).slice(0, 200)}"`;
}

/* Helper: getResponseForPrompt
   - tries runLLM when available
   - catches errors / quota responses and falls back to mock
   - always returns a string
*/
async function getResponseForPrompt(prompt) {
  // if explicitly disabled via env, use mock
  if (process.env.LLM_DISABLED === 'true' || !runLLM) {
    return mockLLMResponse(prompt);
  }

  try {
    const txt = await runLLM(prompt);
    // If runLLM returns something falsy, treat as failure
    if (!txt || typeof txt !== 'string') {
      console.warn('[llm] runLLM returned empty/non-string, using fallback');
      return mockLLMResponse(prompt);
    }
    return txt;
  } catch (err) {
    // Keep the error log for diagnostics
    console.error('[llm] Error generating content - falling back to mock:', err && err.message ? err.message : err);
    // Return a clear fallback string so UI shows something meaningful
    return mockLLMResponse(prompt);
  }
}

/* POST /api/experiments/run
   - Accepts { basePrompt, variables }
   - Will attempt to generate variants with LLM (if available)
   - Will ALWAYS save an Experiment doc (unless Mongo write fails)
*/
router.post('/run', async (req, res) => {
  try {
    const { basePrompt, variables } = req.body || {};
    if (!basePrompt) {
      return res.status(400).json({ error: 'basePrompt required' });
    }

    const prompts = generateVariants(basePrompt, variables);
    const variants = [];

    // Generate responses serially (keeps logs clear). If you want speed, we can parallelize later.
    for (let i = 0; i < prompts.length; i++) {
      const prompt = prompts[i];

      // safe generation with fallback
      const responseText = await getResponseForPrompt(prompt);

      // compute metrics even for fallback responses
      const metrics = analyze(responseText);

      variants.push({
        id: `v${i + 1}`,
        prompt,
        response: responseText,
        metrics,
      });
    }

    // Save to Mongo — this is wrapped in try/catch but we try to save always.
    let saved = null;
    try {
      const doc = new Experiment({
        basePrompt,
        variables: variables || {},
        variants,
      });
      saved = await doc.save();
    } catch (err) {
      // log but continue: we return results to client even when saving fails
      console.warn('⚠ Mongo save failed (non-fatal):', err && err.message ? err.message : err);
    }

    return res.json({
      ok: true,
      experimentId: saved ? saved._id : null,
      variants,
    });
  } catch (err) {
    console.error('Error in /run:', err && err.message ? err.message : err);
    return res.status(500).json({ error: 'server error' });
  }
});

/* GET /api/experiments (latest) */
router.get('/', async (req, res) => {
  try {
    const experiments = await Experiment.find()
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ ok: true, experiments });
  } catch (err) {
    console.error('Error fetching experiments:', err && err.message ? err.message : err);
    res.status(500).json({ ok: false, error: 'server error' });
  }
});

module.exports = router;
