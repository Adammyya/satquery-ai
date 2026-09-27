const API_BASE_URL = "https://satquery-ai-1-ap5j.onrender.com";

export async function analyzeQuery(query, imageFile) {
  if (!imageFile) {
    throw new Error("Please upload a satellite image before analyzing.");
  }

  const formData = new FormData();
  formData.append("query", query);
  formData.append("image", imageFile);

  const response = await fetch(`${API_BASE_URL}/ai/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let message = `Backend request failed: ${response.status}`;

    try {
      const errorData = await response.json();
      if (errorData.detail) {
        
    typeof errorData.detail === "string"
      ? errorData.detail
      : JSON.stringify(errorData.detail);
}
    } catch {
      // Keep the default error message.
    }

    throw new Error(message);
  }

  const data = await response.json();

  return {
    task: data.task,
    answer: data.answer,
    confidence: data.confidence,
    evidence: data.evidence ?? null,
    execution: data.execution ?? {
      model: "SatQuery AI",
      workflow: data.task,
    },
  };
}