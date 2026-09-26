export async function analyzeQuery(query) {
    const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: query,
        }),
    });

    if (!response.ok) {
        throw new Error("Backend request failed");
    }

    return await response.json();
}