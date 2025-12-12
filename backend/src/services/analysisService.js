// backend/src/services/analysisService.js

function analyze(text) {
  if (!text) return { wordCount: 0, certainty: 0, sentimentScore: 0 };

  const words = text.trim().split(/\s+/).length;

  const strong = ['must','should','definitely','always','never','certainly','clearly','obviously'];
  const lower = text.toLowerCase();
  const certaintyHits = strong.reduce(
    (acc, w) => acc + (lower.includes(w) ? 1 : 0), 
    0
  );
  const certainty = Math.min(1, certaintyHits / 3);

  const positive = ['good','great','strong','excellent','positive','helpful','recommend'];
  const negative = ['weak','problem','issue','concern','doubt','negative','difficult'];
  let score = 0;
  positive.forEach(w => { if (lower.includes(w)) score += 1; });
  negative.forEach(w => { if (lower.includes(w)) score -= 1; });

  return {
    wordCount: words,
    certainty,
    sentimentScore: score
  };
}

module.exports = { analyze };
