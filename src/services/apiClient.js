// api.js

// Change to your API endpoint
const API_BASE = "https://gorest.co.in/public/v2";

// Helper to build query string from params object
function buildQuery(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return qs ? `?${qs}` : "";
}

// Generic fetcher with error handling
async function callAPI(resource, { method = "GET", params, body } = {}) {
  const url = `${API_BASE}/${resource}${buildQuery(params)}`;

  const options = {
    method,
    headers: { "Content-Type": "application/json" },
    ...(body && { body: JSON.stringify(body) }),
  };

  const res = await fetch(url, options);
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

// CRUD API functions

export const api = {
  // Get all (with query params support)
  getAll: (resource, params) => callAPI(resource, { params }),

  // Get by ID
  getById: (resource, id, params) => callAPI(`${resource}/${id}`, { params }),

  // Create
  create: (resource, data) => callAPI(resource, { method: "POST", body: data }),

  // Update
  update: (resource, id, data) =>
    callAPI(`${resource}/${id}`, { method: "PUT", body: data }),

  // Partial update (PATCH)
  patch: (resource, id, data) =>
    callAPI(`${resource}/${id}`, { method: "PATCH", body: data }),

  // Delete
  remove: (resource, id) => callAPI(`${resource}/${id}`, { method: "DELETE" }),
};
