// client/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

// ─── Base data ────────────────────────────────────────────────────────────────
export const fetchStudents    = () => api.get('/students').then(r => r.data);
export const fetchSkills      = () => api.get('/skills').then(r => r.data);
export const fetchCareers     = () => api.get('/careers').then(r => r.data);
export const fetchProjects    = () => api.get('/projects').then(r => r.data);
export const fetchStudentProfile = (name) => api.get(`/students/${encodeURIComponent(name)}/skills`).then(r => r.data);

// ─── Discovery ────────────────────────────────────────────────────────────────
export const discoverMentors      = (student, skill) =>
  api.get('/discover/mentors', { params: { student, skill } }).then(r => r.data);

export const discoverProjects     = (skill) =>
  api.get('/discover/projects', { params: { skill } }).then(r => r.data);

export const discoverCareers      = (student) =>
  api.get('/discover/careers', { params: { student } }).then(r => r.data);

export const discoverMissingSkills = (student, career) =>
  api.get('/discover/missing-skills', { params: { student, career } }).then(r => r.data);

export const discoverCompanies    = (skill) =>
  api.get('/discover/companies', { params: { skill } }).then(r => r.data);

export const fetchStudentGraph    = (student) =>
  api.get('/discover/graph', { params: { student } }).then(r => r.data);

export default api;
