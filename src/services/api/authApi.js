const API_BASE_URL = "https://satquery-ai-1-ap5j.onrender.com";

function getBaseUrl() {
  return import.meta.env.VITE_API_URL || API_BASE_URL;
}

export async function loginUser(email, password) {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const response = await fetch(`${getBaseUrl()}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Invalid email or password.");
  }
  return response.json();
}

export async function registerUser(name, email, password) {
  const response = await fetch(`${getBaseUrl()}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Registration failed.");
  }
  return response.json();
}

export async function fetchCurrentUser(token) {
  const response = await fetch(`${getBaseUrl()}/api/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user.");
  }
  return response.json();
}

export async function fetchUserHistory(token) {
  const response = await fetch(`${getBaseUrl()}/api/history`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch history.");
  }
  return response.json();
}
