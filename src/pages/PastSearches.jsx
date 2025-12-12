// src/pages/PastSearches.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PastSearches() {
  const [experiments, setExperiments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:5001/api/experiments");
        const data = await res.json();
        if (data.ok) setExperiments(data.experiments);
      } catch (err) {
        console.error("Error fetching past searches:", err);
      }
    }
    load();
  }, []);

  return (
    <div className="page">
      <section className="results-panel leaderboard">
        <h2 className="results-title">PAST SEARCHES</h2>

        <div className="leaderboard-column">
          {experiments.map((exp, i) => (
            <div
              key={exp._id}
              className="leaderboard-card"
              style={{
                animationDelay: `${i * 0.15}s`, // stagger animation
              }}
              onClick={() =>
                navigate("/results", {
                  state: {
                    basePrompt: exp.basePrompt,
                    variants: exp.variants,
                    experimentId: exp._id,
                  },
                })
              }
            >
              <p className="leaderboard-title">{exp.basePrompt}</p>

              <div className="leaderboard-tags">
                <span className="tag">
  {Object.values(exp.variables || {}).flat().length} variables
</span>

                <span className="tag">{exp.variants.length} variants</span>
              </div>

              <span className="leaderboard-date">
                {new Date(exp.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
