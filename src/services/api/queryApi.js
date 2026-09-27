const API_BASE_URL = "https://satquery-ai-1-ap5j.onrender.com";

async function resolveImageFile(image) {
  if (!image) {
    throw new Error("No satellite imagery is loaded.");
  }

  // Local uploaded image
  if (image.file instanceof File) {
    return image.file;
  }

  // Built-in/demo imagery
  if (image.assetUrl) {
    const response = await fetch(image.assetUrl);

    if (!response.ok) {
      throw new Error("Unable to load the selected satellite imagery.");
    }

    const blob = await response.blob();

    return new File(
      [blob],
      image.filename || "satellite_image.jpg",
      {
        type: blob.type || "image/jpeg",
      }
    );
  }

  throw new Error("No usable image file is available.");
}

export async function analyzeQuery(query, image) {
  if (!query?.trim()) {
    throw new Error("Please enter an analysis query.");
  }

  const imageFile = await resolveImageFile(image);

  const formData = new FormData();

  formData.append("query", query.trim());
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
        message =
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
    workflow: data.workflow,
    answer: data.answer,
    confidence: data.confidence,
    uncertainty: data.uncertainty,
    evidence: data.evidence ?? null,
    trace_events: data.trace_events ?? [],
    execution: data.execution ?? {
      model: "SatQuery AI",
      workflow: data.workflow || data.task,
      agents: [],
    },
  };
}