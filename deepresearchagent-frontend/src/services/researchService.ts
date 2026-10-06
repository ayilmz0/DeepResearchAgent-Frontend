const API_URL = "http://localhost:5091/api/research";

export interface CreateResearchRequest {
  query: string;
}

export interface CreateResearchResponse {
  id: string;
}

export interface GetResearchResponse {
  id: string;
  query: string;
  status: string;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
}

export interface GetReportResponse {
  id: string;
  researchId: string;
  title: string;
  content: string;
  createdAt: string;
}

export async function createResearch(
  request: CreateResearchRequest
): Promise<CreateResearchResponse> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Research oluşturulamadı.");
  }

  return response.json();
}

export async function getResearchById(
  id: string
): Promise<GetResearchResponse> {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Research bulunamadı.");
  }

  return response.json();
}

export async function getResearchReport(
  researchId: string
): Promise<GetReportResponse> {
  const response = await fetch(
    `${API_URL}/${researchId}/report`
  );

  if (!response.ok) {
    throw new Error("Research report alınamadı.");
  }

  return response.json();
}