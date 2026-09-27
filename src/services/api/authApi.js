const API_BASE_URL = "https://satquery-ai-1-ap5j.onrender.com";

function getBaseUrl() {
  return import.meta.env.VITE_API_URL || API_BASE_URL;
}

// ── Login ────────────────────────────────────────────────────────────────────
export async function loginUser(email, password) {
  const response = await fetch(`${getBaseUrl()}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Login failed.");
  }
  // Returns { access_token, token_type, user: { id, name, email } }
  return data;
}

// ── Register ─────────────────────────────────────────────────────────────────
export async function registerUser(name, email, password) {
  const response = await fetch(`${getBaseUrl()}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Registration failed.");
  }
  // Returns { access_token, token_type, user: { id, name, email } }
  return data;
}

// ── Me ───────────────────────────────────────────────────────────────────────
export async function fetchCurrentUser(token) {
  const response = await fetch(`${getBaseUrl()}/api/auth/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Session expired. Please log in again.");
  }
  return response.json();
}

// ── History ──────────────────────────────────────────────────────────────────
export async function fetchUserHistory(token) {
  const response = await fetch(`${getBaseUrl()}/api/auth/history`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch history.");
  }
  return response.json();
}
