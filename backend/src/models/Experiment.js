// backend/src/models/Experiment.js
const mongoose = require('mongoose');

const VariantSchema = new mongoose.Schema({
  id: String,
  prompt: String,
  response: String,
  metrics: {
    wordCount: Number,
    certainty: Number,
    sentimentScore: Number
  }
}, { _id: false });

const ExperimentSchema = new mongoose.Schema({
  basePrompt: { type: String, required: true },
  variables: { type: Object, default: {} },
  variants: [VariantSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Experiment', ExperimentSchema);
