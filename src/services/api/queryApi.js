const API_BASE_URL = "http://127.0.0.1:8000";

export async function analyzeQuery(query, image) {
  if (!image?.assetUrl) {
    throw new Error("No imagery is available for analysis.");
  }

  const imageResponse = await fetch(image.assetUrl);

  if (!imageResponse.ok) {
    throw new Error(
      `Could not load imagery: ${imageResponse.status}`
    );
  }

  const imageBlob = await imageResponse.blob();

  const formData = new FormData();

  formData.append("query", query);

  formData.append(
    "image",
    imageBlob,
    image.filename || "satquery-image.jpeg"
  );

  const response = await fetch(`${API_BASE_URL}/ai/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let detail = `Backend request failed: ${response.status}`;

    try {
      const errorData = await response.json();

      if (errorData.detail) {
        detail = errorData.detail;
      }
    } catch {
      // Keep the default error message.
    }

    throw new Error(detail);
  }

  const data = await response.json();

  return {
    task: data.task,
    answer: data.answer,
    confidence: data.confidence,
    evidence: null,
    execution: {
      model: data.model || "SatQuery Backend",
      workflow: data.task,
    },
  };
}