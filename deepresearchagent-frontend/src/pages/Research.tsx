import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getResearchById,
  type GetResearchResponse,
} from "../services/researchService";

const researchStatuses = [
  "Planning",
  "Searching",
  "Crawling",
  "Analyzing",
  "Verifying",
  "GeneratingReport",
  "Completed",
];

const statusLabels: Record<string, string> = {
  Planning: "Planning Research",
  Searching: "Searching Sources",
  Crawling: "Analyzing Web Sources",
  Analyzing: "Extracting Facts",
  Verifying: "Verifying Evidence",
  GeneratingReport: "Generating Report",
  Completed: "Research Completed",
};

const statusDescriptions: Record<string, string> = {
  Planning:
    "Creating an autonomous research strategy",
  Searching:
    "Finding relevant sources across the web",
  Crawling:
    "Reading and analyzing source content",
  Analyzing:
    "Extracting relevant facts and claims",
  Verifying:
    "Cross-checking evidence across sources",
  GeneratingReport:
    "Building your research report",
  Completed:
    "Your research is ready",
};

function Research() {
  const { id } = useParams<{ id: string }>();

  const [research, setResearch] =
    useState<GetResearchResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    let cancelled = false;

    const loadResearch = async () => {
      try {
        const result =
          await getResearchById(id);

        if (cancelled) {
          return;
        }

        setResearch(result);
        setLoading(false);

        if (
          result.status === "Completed" ||
          result.status === "Failed"
        ) {
          return;
        }

        setTimeout(loadResearch, 2000);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(error);

        setError(
          "Research bilgileri alınamadı."
        );

        setLoading(false);
      }
    };

    loadResearch();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!id) {
    return (
      <main className="state-page">
        <div className="state-card">
          <div className="state-icon">?</div>

          <h1>Research Not Found</h1>

          <p>
            Research ID bulunamadı.
          </p>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="state-page">
        <div className="loading-orb">
          <span />
        </div>

        <h1>Loading Research</h1>

        <p>
          Connecting to the research engine...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="state-page">
        <div className="state-card error-card">

          <div className="state-icon">
            !
          </div>

          <h1>
            Something went wrong
          </h1>

          <p>{error}</p>

        </div>
      </main>
    );
  }

  if (!research) {
    return (
      <main className="state-page">
        <div className="state-card">

          <div className="state-icon">
            ?
          </div>

          <h1>
            Research Not Found
          </h1>

          <p>
            Research bulunamadı.
          </p>

        </div>
      </main>
    );
  }

  const currentStatusIndex =
    researchStatuses.indexOf(
      research.status
    );

  const isFailed =
    research.status === "Failed";

  const progressPercentage =
    research.status === "Completed"
      ? 100
      : Math.max(
          5,
          ((currentStatusIndex + 1) /
            researchStatuses.length) *
            100
        );

  return (
    <main className="research-page">

      <div className="research-background-glow" />

      <nav className="research-navbar">

        <div className="brand">

          <div className="brand-icon">
            ✦
          </div>

          <span>
            Deep<span>Research</span>
          </span>

        </div>

        <div className="research-id">
          Research ID:
          <span>
            {research.id.substring(0, 8)}...
          </span>
        </div>

      </nav>

      <section className="research-main">

        <div className="research-top">

          <div>

            <div className="live-badge">
              <span className="pulse-dot" />

              {isFailed
                ? "Research Failed"
                : research.status ===
                  "Completed"
                ? "Research Complete"
                : "Research In Progress"}
            </div>

            <h1>
              {research.query}
            </h1>

          </div>

          <div className="progress-circle">

            <svg
              viewBox="0 0 100 100"
            >
              <circle
                className="circle-background"
                cx="50"
                cy="50"
                r="42"
              />

              <circle
                className="circle-progress"
                cx="50"
                cy="50"
                r="42"
                style={{
                  strokeDashoffset:
                    264 -
                    (264 *
                      progressPercentage) /
                      100,
                }}
              />
            </svg>

            <div className="progress-number">
              {Math.round(
                progressPercentage
              )}
              <span>%</span>
            </div>

          </div>

        </div>

        <section className="progress-card">

          <div className="section-heading">

            <div>
              <span>
                RESEARCH ENGINE
              </span>

              <h2>
                Research Progress
              </h2>
            </div>

            {!isFailed &&
              research.status !==
                "Completed" && (
                <div className="live-indicator">
                  <span />
                  LIVE
                </div>
              )}

          </div>

          {isFailed ? (
            <div className="failed-box">

              <div className="failed-icon">
                !
              </div>

              <div>
                <h3>
                  Research failed
                </h3>

                <p>
                  The research process could
                  not be completed.
                </p>
              </div>

            </div>
          ) : (
            <div className="timeline">

              {researchStatuses.map(
                (status, index) => {

                  const isCompleted =
                    index <
                    currentStatusIndex;

                  const isCurrent =
                    index ===
                    currentStatusIndex;

                  return (
                    <div
                      key={status}
                      className={`timeline-item ${
                        isCompleted
                          ? "completed"
                          : isCurrent
                            ? "current"
                            : "pending"
                      }`}
                    >

                      <div className="timeline-line" />

                      <div className="timeline-node">

                        {isCompleted
                          ? "✓"
                          : isCurrent
                            ? ""
                            : index + 1}

                      </div>

                      <div className="timeline-content">

                        <div className="timeline-title">
                          <strong>
                            {statusLabels[
                              status
                            ]}
                          </strong>

                          {isCurrent && (
                            <span className="working-badge">
                              WORKING
                            </span>
                          )}

                        </div>

                        <p>
                          {
                            statusDescriptions[
                              status
                            ]
                          }
                        </p>

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </section>

        <section className="details-grid">

          <div className="info-card">

            <div className="info-card-icon">
              ◷
            </div>

            <div>
              <span>
                CREATED
              </span>

              <strong>
                {new Date(
                  research.createdAt
                ).toLocaleString()}
              </strong>
            </div>

          </div>

          <div className="info-card">

            <div className="info-card-icon">
              ◉
            </div>

            <div>
              <span>
                STATUS
              </span>

              <strong>
                {statusLabels[
                  research.status
                ] ?? research.status}
              </strong>
            </div>

          </div>

          <div className="info-card">

            <div className="info-card-icon">
              ⚡
            </div>

            <div>
              <span>
                ENGINE
              </span>

              <strong>
                Deep Research Agent
              </strong>
            </div>

          </div>

        </section>

        {research.status ===
          "Completed" && (
          <section className="report-placeholder">

            <div className="report-placeholder-icon">
              ✦
            </div>

            <div>
              <span>
                RESEARCH COMPLETE
              </span>

              <h2>
                Your research is ready
              </h2>

              <p>
                The research engine has finished
                analyzing the available evidence.
              </p>
            </div>

          </section>
        )}

      </section>

    </main>
  );
}

export default Research;