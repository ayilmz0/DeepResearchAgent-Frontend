import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createResearch } from "../services/researchService";

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
      setError("Research başlatılırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="home">
      <section className="hero">
        <h1>DeepSearchAgent</h1>

        <p className="subtitle">
          Autonomous Deep Research & Market Intelligence Agent
        </p>

        <div className="research-box">
          <label htmlFor="research-query">
            What do you want to research?
          </label>

          <textarea
            id="research-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Example: What is the impact of artificial intelligence on the textile industry?"
            rows={6}
          />

          {error && <p>{error}</p>}

          <button
            onClick={handleStartResearch}
            disabled={!query.trim() || loading}
          >
            {loading ? "Starting..." : "Start Research"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default Home;