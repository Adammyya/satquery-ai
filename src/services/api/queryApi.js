const API_BASE_URL = "http://127.0.0.1:8000";

export async function analyzeQuery(query) {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
    }),
  });

  if (!response.ok) {
    throw new Error(`Backend request failed: ${response.status}`);
  }

  const data = await response.json();

  return {
    task: data.task,
    answer: data.answer,
    confidence: data.confidence,
    evidence: null,
    execution: {
      model: "SatQuery Backend",
      workflow: data.task,
    },
  };
}