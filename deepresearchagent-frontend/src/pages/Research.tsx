import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getResearchById,
  type GetResearchResponse,
} from "../services/researchService";

function Research() {
  const { id } = useParams<{ id: string }>();

  const [research, setResearch] = useState<GetResearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadResearch = async () => {
      if (!id) {
        setError("Research ID bulunamadı.");
        setLoading(false);
        return;
      }

      try {
        const result = await getResearchById(id);
        setResearch(result);
      } catch (error) {
        console.error(error);
        setError("Research bilgileri alınamadı.");
      } finally {
        setLoading(false);
      }
    };

    loadResearch();
  }, [id]);

  if (loading) {
    return (
      <main>
        <h1>Research</h1>
        <p>Research bilgileri yükleniyor...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>Research</h1>
        <p>{error}</p>
      </main>
    );
  }

  if (!research) {
    return (
      <main>
        <h1>Research</h1>
        <p>Research bulunamadı.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Research</h1>

      <p>
        <strong>Query:</strong> {research.query}
      </p>

      <p>
        <strong>Current status:</strong>
      </p>

      <strong>{research.status}</strong>

      <p>
        <strong>Created at:</strong>{" "}
        {new Date(research.createdAt).toLocaleString()}
      </p>
    </main>
  );
}

export default Research;