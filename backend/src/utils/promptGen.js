// backend/src/utils/promptGen.js

// Helper: Compute cartesian product of arrays
function cartesian(arrays) {
  return arrays.reduce((a, b) => 
    a.flatMap(d => b.map(e => [...d, e])), [[]]
  );
}

/**
 * generateVariants(basePrompt, variables)
 * 
 * variables is an object:
 * {
 *   identity: ["woman", "man"],
 *   tone: ["formal", "casual"]
 * }
 * 
 * Returns an array of full prompts.
 */
function generateVariants(basePrompt, variables = {}) {
  const keys = Object.keys(variables);

  // If no variables, return only the base prompt
  if (keys.length === 0) return [basePrompt];

  // values = [ ["woman","man"], ["formal","casual"] ]
  const values = keys.map(k => variables[k]);

  // cartesian combinations:
  const combos = cartesian(values);

  // format each combo into a full prompt
  return combos.map(combo => {
    const prefix = combo
      .map((val, i) => `${keys[i]}: ${val}`)
      .join(". ");

    return `${prefix}. ${basePrompt}`;
  });
}

module.exports = { generateVariants };
