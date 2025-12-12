// src/pages/Home.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Refs for intersection observer
  const heroRef = useRef(null);
  const iterateRef = useRef(null);

  // Slide up once when hero becomes visible
  useEffect(() => {
    // Reduced motion users: immediately show
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      iterateRef.current?.classList.add("visible");
      return;
    }

    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            iterateRef.current?.classList.add("visible");
            observer.disconnect(); // animate only once
          }
        });
      },
      { threshold: 0.35 }
    );

    if (heroRef.current) obs.observe(heroRef.current);

    return () => obs.disconnect();
  }, []);

  const handleGenerate = async () => {
    console.log("[home] handleGenerate called —", { query });
    setError(null);

    if (!query.trim()) {
      console.log("[home] empty query, aborting");
      setError("Please type a prompt first.");
      return;
    }

    setLoading(true);
    try {
      console.log("[home] sending request to backend...");
      const res = await fetch("http://localhost:5001/api/experiments/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          basePrompt: query,
          variables: {
            identity: ["woman", "man"],
            location: ["India", "USA"],
          },
        }),
      });

      console.log("[home] fetch completed, status:", res.status);

      if (!res.ok) {
        const text = await res.text();
        console.error("[home] server error:", res.status, text);
        setError(`Server error: ${res.status}`);
        return;
      }

      const data = await res.json();
      console.log("[home] backend returned:", data);

      // Navigate with backend results
      navigate("/results", {
        state: {
          basePrompt: query,
          variants: data.variants || [],
          experimentId: data.experimentId || null,
        },
      });
      console.log("[home] navigate called -> /results");
    } catch (err) {
      console.error("[home] Frontend → backend error:", err);
      setError("Network error — see console for details.");
    } finally {
      setLoading(false);
    }
  };

  // allow Enter to trigger generate from the input
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleGenerate();
    }
  };

  return (
    <div className="page">
      {/* NAVBAR */}
      <header className="nav-wrapper">
        <div className="nav-pill">
          <div className="nav-left">REITERATE</div>

          <nav className="nav-links" aria-label="Main navigation">
            <button className="nav-link">Home</button>
            <button className="nav-link">Past searches</button>
            <button className="nav-link">About</button>
            <button className="nav-link">Location</button>
            <button className="nav-link">News</button>
          </nav>

          <div className="nav-search-icon" aria-hidden>
            ⌕
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" ref={heroRef}>
        <div className="hero-left">
          <h1 className="bias-title">BIAS</h1>
          <p className="bias-desc">
            Analyze how large language models respond differently to small prompt
            changes.
          </p>
        </div>

        <div className="hero-center">
          {/* SEARCH BLOCK: wrapper that centers the button under the input */}
          <div className="search-block">
            <div className="search-bar" role="search">
              <input
                aria-label="Base prompt"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a base prompt (e.g. 'How can I improve my scholarship application?')"
              />

              {/* Inline SVG icon for crisp scaling */}
              <span className="search-icon" aria-hidden>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M21 21L16.65 16.65"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.7"
                  />
                  <circle
                    cx="11"
                    cy="11"
                    r="6.2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    opacity="0.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </span>
            </div>

            <button
              className="generate-btn"
              onClick={handleGenerate}
              disabled={loading}
              aria-busy={loading ? "true" : "false"}
            >
              {loading ? "Generating…" : "Generate"}
            </button>

            {error && (
              <div style={{ marginTop: 8, color: "#ff8080", fontSize: 13 }}>{error}</div>
            )}
          </div>
        </div>
      </section>

      {/* BIG STATEMENT — placed OUTSIDE hero so it visually sits below/left */}
      <div className="iterate-text" ref={iterateRef} aria-hidden>
        RE
        <br />
        ITERATE
      </div>
    </div>
  );
}
