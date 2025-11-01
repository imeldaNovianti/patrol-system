import axios from "axios";

const API_BASE = "/api"; // Vite proxy handle ke PHP backend

export const login = async ({ username, password }) => {
  const res = await axios.post(`${API_BASE}/auth.php?action=login`, {
    username,
    password,
  });
  return res.data;
};

export const getAreas = async () => {
  const res = await axios.get(`${API_BASE}/areas_list.php`);
  return res.data;
};

// Tambahan sesuai backend lainnya
export const createPatrol = async (data) => {
  const res = await axios.post(`${API_BASE}/patrols_create.php`, data);
  return res.data;
};

export const createFinding = async (formData) => {
  const res = await axios.post(`${API_BASE}/findings_create.php`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getFindings = async () => {
  const res = await axios.get(`${API_BASE}/findings_list.php`);
  return res.data;
};

export const getCumulativeStats = async (start, end) => {
  const res = await axios.get(`${API_BASE}/stats_cumulative.php`, {
    params: { start, end },
  });
  return res.data;
};
