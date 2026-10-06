import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createResearch } from "../services/researchService";

const exampleQueries = [
  "What is the impact of artificial intelligence on the textile industry?",
  "How will AI agents change software development?",
  "What are the fastest growing technologies in 2026?",
];

function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleStartResearch = async () => {
    if (!query.trim()) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await createResearch({
        query: query.trim(),
      });

      navigate(`/research/${result.id}`);
    } catch (error) {
      console.error(error);
      setError(
        "Research başlatılırken bir hata oluştu."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
  };

  return (
    <main className="home-page">

      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      <nav className="navbar">

        <div className="brand">
          <div className="brand-icon">
            ✦
          </div>

          <span>
            Deep<span>Research</span>
          </span>
        </div>

        <div className="nav-badge">
          AI Research Agent
        </div>

      </nav>

      <section className="hero">

        <div className="hero-badge">
          <span className="pulse-dot" />
          Autonomous Research Engine
        </div>

        <h1>
          Turn questions into
          <span> deep insights.</span>
        </h1>

        <p className="hero-description">
          DeepResearch autonomously searches the web,
          analyzes sources, verifies facts and builds
          evidence-backed research reports.
        </p>

        <div className="research-card">

          <div className="card-header">

            <div>
              <span className="input-label">
                RESEARCH TOPIC
              </span>

              <h2>
                What do you want to discover?
              </h2>
            </div>

            <div className="ai-icon">
              ✦
            </div>

          </div>

          <textarea
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Ask anything... For example: What is the impact of AI on the textile industry?"
            rows={5}
          />

          <div className="card-footer">

            <span className="character-count">
              {query.length} characters
            </span>

            <button
              className="start-button"
              onClick={handleStartResearch}
              disabled={
                !query.trim() || loading
              }
            >
              {loading ? (
                <>
                  <span className="button-spinner" />
                  Starting...
                </>
              ) : (
                <>
                  Start Research
                  <span>→</span>
                </>
              )}
            </button>

          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

        </div>

        <div className="examples">

          <span className="examples-title">
            Try an example
          </span>

          <div className="example-list">

            {exampleQueries.map(
              (example) => (
                <button
                  key={example}
                  onClick={() =>
                    handleExampleClick(
                      example
                    )
                  }
                >
                  {example}
                </button>
              )
            )}

          </div>

        </div>

      </section>

      <section className="features">

        <div className="feature-card">

          <div className="feature-icon">
            ◎
          </div>

          <h3>
            Autonomous Search
          </h3>

          <p>
            Builds a research strategy and
            explores relevant sources automatically.
          </p>

        </div>

        <div className="feature-card">

          <div className="feature-icon">
            ◈
          </div>

          <h3>
            Fact Verification
          </h3>

          <p>
            Cross-checks claims across multiple
            independent sources.
          </p>

        </div>

        <div className="feature-card">

          <div className="feature-icon">
            ✦
          </div>

          <h3>
            Evidence-Based Reports
          </h3>

          <p>
            Converts collected evidence into
            structured research reports.
          </p>

        </div>

      </section>

      <footer className="home-footer">
        <span>
          DeepResearch Agent
        </span>

        <span>
          Autonomous Market Intelligence
        </span>
      </footer>

    </main>
  );
}

export default Home;