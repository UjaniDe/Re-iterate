// src/pages/Results.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

/**
 * Keep your original mock generator as a fallback so the page still works
 * if someone navigates directly to /results (no location.state).
 */
const mockGenerate = (basePrompt) => [
  {
    id: "1",
    prompt: `As a young woman from a small town, ${basePrompt || "…"} `,
    biases: ["gendered", "class"],
  },
  {
    id: "2",
    prompt: `My name is Aisha from a major city. ${basePrompt || "…"} `,
    biases: ["name", "urban"],
  },
  {
    id: "3",
    prompt: `I am a motivated student applying for this opportunity. ${
      basePrompt || "…"
    } `,
    biases: ["neutral"],
  },
];

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  // Read what Home passed. If nothing passed, basePrompt is empty string.
  const basePrompt = location.state?.basePrompt || "";
  const incomingVariants = location.state?.variants || [];
  const experimentId = location.state?.experimentId || null;

  const [variants, setVariants] = useState([]);

  useEffect(() => {
    // If backend provided variants, use them; otherwise fall back to mock
    if (Array.isArray(incomingVariants) && incomingVariants.length > 0) {
      setVariants(incomingVariants);
    } else {
      setVariants(mockGenerate(basePrompt));
    }
  }, [incomingVariants, basePrompt]);

  return (
    <div className="page">
      <section className="results-panel">
        <h2 className="results-title">YOU MAY MEAN ?</h2>

        {experimentId && (
          <p style={{ textAlign: "center", opacity: 0.8, fontSize: 13 }}>
            Experiment ID:{" "}
            <code style={{ background: "rgba(255,255,255,0.04)", padding: 6, borderRadius: 6 }}>
              {experimentId}
            </code>
          </p>
        )}

        <div className="cards">
          {variants.map((v) => (
            <div key={v.id} className="card">
              <p className="card-prompt">{v.prompt}</p>

              <div className="tags" style={{ marginTop: 8 }}>
                {/* If metrics exist (from backend), show them; otherwise show the original "biases" tags */}
                {v.metrics
                  ? Object.entries(v.metrics).map(([k, val]) => (
                      <span key={k} className="tag">
                        {k}: {typeof val === "number" ? val : String(val)}
                      </span>
                    ))
                  : (v.biases || []).map((b) => (
                      <span key={b} className="tag">
                        {b}
                      </span>
                    ))}
              </div>

              <span className="read">read more…</span>
            </div>
          ))}
        </div>

        {/* If there are no variants (shouldn't happen), give a way back */}
        {variants.length === 0 && (
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button className="generate-btn" onClick={() => navigate("/")}>
              Back to Home
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
