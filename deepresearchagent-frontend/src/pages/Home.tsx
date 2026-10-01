import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [query, setQuery] = useState("");

  const navigate = useNavigate();

  const handleStartResearch = () => {
    console.log("Research query:", query);

    navigate("/research/1");
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

          <button
            onClick={handleStartResearch}
            disabled={!query.trim()}
          >
            Start Research
          </button>
        </div>
      </section>
    </main>
  );
}

export default Home;