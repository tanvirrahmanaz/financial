export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
export const get = (path) => fetch(`${API_BASE}${path}`);
export const post = (path, body) => fetch(`${API_BASE}${path}`, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(body)});
