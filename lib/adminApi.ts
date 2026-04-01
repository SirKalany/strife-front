import { getToken } from "@/lib/auth";

const API_BASE = "http://localhost:8080/api/admin";

async function authFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = getToken();
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}

export const adminApi = {
  login: async (username: string, password: string): Promise<string> => {
    const res = await fetch("http://localhost:8080/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error("Invalid credentials");
    const data = await res.json();
    return data.token;
  },

  createCountry: async (body: object) => {
    const res = await authFetch("/countries", {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Failed to create country");
    return res.json();
  },

  createFamily: async (body: object) => {
    const res = await authFetch("/families", {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Failed to create family");
    return res.json();
  },

  createModel: async (body: object) => {
    const res = await authFetch("/models", {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Failed to create model");
    return res.json();
  },

  updateModel: async (slug: string, body: object) => {
    const res = await authFetch(`/models/${slug}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Failed to update model");
    return res.json();
  },

  deleteModel: async (slug: string) => {
    const res = await authFetch(`/models/${slug}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete model");
  },

  deleteFamily: async (slug: string) => {
    const res = await authFetch(`/families/${slug}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete family");
  },

  deleteCountry: async (slug: string) => {
    const res = await authFetch(`/countries/${slug}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete country");
  },
};
