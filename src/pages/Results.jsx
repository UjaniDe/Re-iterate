// src/pages/Results.jsx
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

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
  const basePrompt = location.state?.basePrompt || "";
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    setVariants(mockGenerate(basePrompt));
  }, [basePrompt]);

  return (
    <div className="page">
      <section className="results-panel">
        <h2 className="results-title">YOU MAY MEAN ?</h2>

        <div className="cards">
          {variants.map((v) => (
            <div key={v.id} className="card">
              <p className="card-prompt">{v.prompt}</p>
              <div className="tags">
                {v.biases.map((b) => (
                  <span key={b} className="tag">
                    {b}
                  </span>
                ))}
              </div>
              <span className="read">read more…</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
