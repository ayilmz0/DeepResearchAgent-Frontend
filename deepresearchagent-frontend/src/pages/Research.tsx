
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getResearchById,
  getResearchReport,
  type GetResearchResponse,
  type GetReportResponse,
} from "../services/researchService";
import "./research.css";

const statuses = [
  "Planning",
  "Searching",
  "Crawling",
  "Analyzing",
  "Verifying",
  "GeneratingReport",
  "Completed",
];

const statusInfo: Record<string, { title: string; description: string }> = {
  Planning: {
    title: "Planning research",
    description: "Creating a strategy and identifying relevant topics.",
  },
  Searching: {
    title: "Searching the web",
    description: "Finding relevant sources and collecting information.",
  },
  Crawling: {
    title: "Collecting information",
    description: "Reading sources and gathering research material.",
  },
  Analyzing: {
    title: "Analyzing information",
    description: "Extracting findings and identifying key insights.",
  },
  Verifying: {
    title: "Verifying findings",
    description: "Checking findings against the collected evidence.",
  },
  GeneratingReport: {
    title: "Generating report",
    description: "Preparing your final research report.",
  },
  Completed: {
    title: "Research completed",
    description: "Your research report is ready.",
  },
  Failed: {
    title: "Research failed",
    description: "An error occurred during the research process.",
  },
};

function getProgress(status: string): number {
  if (status === "Completed") return 100;

  const index = statuses.indexOf(status);
  if (index < 0) return 0;

  return Math.round((index / (statuses.length - 1)) * 100);
}

export default function Research() {
  const { id } = useParams<{ id: string }>();

  const [research, setResearch] = useState<GetResearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [report, setReport] = useState<GetReportResponse | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
  if (!id) {
    return;
  }

  let cancelled = false;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const loadResearch = async () => {
    try {
      const result = await getResearchById(id);

      if (cancelled) return;

      setResearch(result);
      setError("");
      setLoading(false);

      if (
        result.status !== "Completed" &&
        result.status !== "Failed"
      ) {
        timeoutId = setTimeout(loadResearch, 2000);
      }
    } catch (err) {
      if (cancelled) return;

      console.error("Research yüklenemedi:", err);
      setError("Research bilgileri alınamadı.");
      setLoading(false);
    }
  };

  void loadResearch();

  return () => {
    cancelled = true;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };
}, [id]);

  useEffect(() => {
    if (!id || research?.status !== "Completed") return;

    let cancelled = false;

    const loadReport = async () => {
      try {
        setReportLoading(true);
        setReportError("");

        const result = await getResearchReport(id);
        if (!cancelled) setReport(result);
      } catch (err) {
        console.error("Report yüklenemedi:", err);

        if (!cancelled) {
          setReportError(
            "Rapor yüklenemedi. Sayfayı yenileyip tekrar deneyin."
          );
        }
      } finally {
        if (!cancelled) setReportLoading(false);
      }
    };

    void loadReport();

    return () => {
      cancelled = true;
    };
  }, [id, research?.status]);

  const handleCopyReport = async () => {
    if (!report?.content) return;

    try {
      await navigator.clipboard.writeText(report.content);
      setCopyMessage("Rapor başarıyla kopyalandı.");
      setReportError("");
    } catch (err) {
      console.error("Rapor kopyalanamadı:", err);
      setCopyMessage("");
      setReportError("Rapor kopyalanamadı. Tarayıcı izinlerini kontrol edin.");
    }
  };

  if (loading) {
    return (
      <main className="research-state-page">
        <div className="research-state-card">
          <div className="loading-spinner" />
          <h2>Loading research...</h2>
          <p>Research bilgileri yükleniyor.</p>
        </div>
      </main>
    );
  }

  if (error || !research) {
    return (
      <main className="research-state-page">
        <div className="research-state-card">
          <div className="state-icon state-icon-error">!</div>
          <h2>Something went wrong</h2>
          <p>{error || "Research bulunamadı."}</p>
          <button className="start-button" onClick={() => window.location.reload()}>
            Try Again
          </button>
          <p><Link to="/">Back to home</Link></p>
        </div>
      </main>
    );
  }

  const progress = getProgress(research.status);
  const currentStatus = statusInfo[research.status] ?? {
    title: research.status,
    description: "Research is being processed.",
  };

  return (
    <main className="research-page">
      <nav className="research-nav">
        <Link to="/" className="brand">
          <span className="brand-icon">✦</span>
          <span>DeepResearch<span className="brand-accent">Agent</span></span>
        </Link>

        <span className="nav-status">
          <span className={`status-dot ${research.status === "Completed" ? "status-dot-complete" : research.status === "Failed" ? "status-dot-error" : ""}`} />
          {research.status === "Completed"
            ? "Completed"
            : research.status === "Failed"
              ? "Failed"
              : "Research in progress"}
        </span>
      </nav>

      <div className="research-container">
        <header className="research-heading">
          <span className="eyebrow">AUTONOMOUS RESEARCH</span>
          <h1>Your research journey</h1>
          <p>Follow your AI agent as it explores, analyzes, and verifies information.</p>
        </header>

        <section className="research-query-card">
          <div className="query-card-top">
            <span className="query-label">YOUR RESEARCH QUERY</span>
            <span className="query-id">ID: {research.id}</span>
          </div>
          <h2>{research.query}</h2>
        </section>

        {research.status === "Failed" ? (
          <section className="research-failed-card">
            <div className="state-icon state-icon-error">!</div>
            <div>
              <h2>Research could not be completed</h2>
              <p>The research process encountered an error. Check the backend logs for details.</p>
            </div>
            <button className="start-button" onClick={() => window.location.reload()}>
              Refresh
            </button>
          </section>
        ) : (
          <>
            <section className="progress-card">
              <div className="progress-main">
                <div className="progress-copy">
                  <span className="eyebrow">CURRENT STATUS</span>
                  <h2>{currentStatus.title}</h2>
                  <p>{currentStatus.description}</p>
                </div>

                <div
                  className="progress-circle"
                  style={{ "--progress": `${progress}%` } as React.CSSProperties}
                  role="img"
                  aria-label={`Research progress: ${progress}%`}
                >
                  <div className="progress-circle-inner">
                    <strong>{progress}%</strong>
                    <span>complete</span>
                  </div>
                </div>
              </div>

              <div
                className="progress-track"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>

              <div className="progress-footer">
                <span>{research.status === "Completed" ? "All stages completed" : "Research runs automatically"}</span>
                {research.completedAt && (
                  <span>Completed {new Date(research.completedAt).toLocaleString()}</span>
                )}
              </div>
            </section>

            <section className="timeline-section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">WORKFLOW</span>
                  <h2>Research stages</h2>
                </div>
                <span className="stage-count">
                  {research.status === "Completed"
                    ? "7 / 7 stages"
                    : `${Math.max(statuses.indexOf(research.status) + 1, 0)} / 7 stages`}
                </span>
              </div>

              <div className="timeline">
                {statuses.map((status, index) => {
                  const currentIndex = statuses.indexOf(research.status);
                  const completed =
                    research.status === "Completed" || index < currentIndex;
                  const active =
                    status === research.status && research.status !== "Completed";
                  const details = statusInfo[status];

                  return (
                    <div
                      className={`timeline-item ${completed ? "is-completed" : ""} ${active ? "is-active" : ""}`}
                      key={status}
                    >
                      <div className="timeline-marker">
                        {completed ? "✓" : active ? <span className="timeline-active-dot" /> : index + 1}
                      </div>

                      <div className="timeline-content">
                        <div className="timeline-title-row">
                          <h3>{details.title}</h3>
                          {completed && <span className="timeline-badge">Completed</span>}
                          {active && <span className="timeline-badge timeline-badge-active">In progress</span>}
                        </div>
                        <p>{details.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="research-details-grid">
              <article className="detail-card">
                <span className="detail-icon">◷</span>
                <div>
                  <span className="detail-label">CREATED AT</span>
                  <strong>{new Date(research.createdAt).toLocaleString()}</strong>
                </div>
              </article>

              <article className="detail-card">
                <span className="detail-icon">▶</span>
                <div>
                  <span className="detail-label">STARTED AT</span>
                  <strong>{research.startedAt ? new Date(research.startedAt).toLocaleString() : "Waiting to start"}</strong>
                </div>
              </article>

              <article className="detail-card">
                <span className="detail-icon">✓</span>
                <div>
                  <span className="detail-label">COMPLETED AT</span>
                  <strong>{research.completedAt ? new Date(research.completedAt).toLocaleString() : "In progress"}</strong>
                </div>
              </article>
            </section>

            {research.status === "Completed" && (
              <section className="report-card">
                <div className="report-header">
                  <div className="report-placeholder-icon">✦</div>
                  <div>
                    <span className="eyebrow">RESEARCH REPORT</span>
                    <h2>{report?.title ?? "Your research report"}</h2>
                    {report && <p>Created at {new Date(report.createdAt).toLocaleString()}</p>}
                  </div>
                </div>

                {reportLoading && (
                  <div className="report-message">
                    <div className="loading-spinner" />
                    <span>Loading your research report...</span>
                  </div>
                )}

                {reportError && <p className="report-error">{reportError}</p>}

                {!reportLoading && report && (
                  <>
                    <div className="report-content">{report.content}</div>
                    <div className="report-actions">
                      <button className="start-button" onClick={() => void handleCopyReport()}>
                        Copy Report <span>⧉</span>
                      </button>
                      {copyMessage && <span className="copy-success">{copyMessage}</span>}
                    </div>
                  </>
                )}

                {!reportLoading && !report && !reportError && (
                  <p className="report-message">Waiting for the report to become available.</p>
                )}
              </section>
            )}
          </>
        )}

        <footer className="research-footer">
          <Link to="/">← Back to home</Link>
          <span>Powered by DeepResearchAgent</span>
        </footer>
      </div>
    </main>
  );
}

