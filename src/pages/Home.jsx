// src/pages/Home.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleGenerate = () => {
    // go to second page, send the base prompt along
    navigate("/results", { state: { basePrompt: query } });
  };

  return (
    <div className="page">
      {/* NAVBAR */}
      <header className="nav-wrapper">
        <div className="nav-pill">
          <div className="nav-left">REITERATE</div>
          <nav className="nav-links">
            <button className="nav-link">Home</button>
            <button className="nav-link">Past searches</button>
            <button className="nav-link">About</button>
            <button className="nav-link">Location</button>
            <button className="nav-link">News</button>
          </nav>
          <div className="nav-search-icon">⌕</div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <h1 className="bias-title">BIAS</h1>
          <p className="bias-desc">
            Analyze how large language models respond differently to small prompt
            changes.
          </p>
        </div>

        <div className="hero-center">
          <div className="search-bar">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search here..."
            />
          </div>
          <button className="generate-btn" onClick={handleGenerate}>
            Generate
          </button>
        </div>

        <div className="hero-right">
          <div className="iterate-text">
            RE
            <br />
            ITERATE
          </div>
        </div>
      </section>
    </div>
  );
}
