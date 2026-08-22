// server/src/routes/discover.js

const express = require('express');
const router  = express.Router();
const {
  findMentors,
  findProjects,
  findCareers,
  findMissingSkills,
  findStudentsAndProjectsBySkill,
  findCompaniesBySkill,
  getStudentGraph,
} = require('../services/discoverService');

// GET /api/discover/mentors?student=Anjali&skill=Python
router.get('/mentors', async (req, res, next) => {
  try {
    const { student, skill } = req.query;
    if (!student) return res.status(400).json({ error: 'student query parameter is required.' });
    const mentors = await findMentors(student, skill || null);
    res.json(mentors);
  } catch (err) {
    next(err);
  }
});

// GET /api/discover/projects?skill=Python
router.get('/projects', async (req, res, next) => {
  try {
    const { skill } = req.query;
    if (!skill) return res.status(400).json({ error: 'skill query parameter is required.' });
    const projects = await findProjects(skill);
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

// GET /api/discover/careers?student=Anjali
router.get('/careers', async (req, res, next) => {
  try {
    const { student } = req.query;
    if (!student) return res.status(400).json({ error: 'student query parameter is required.' });
    const careers = await findCareers(student);
    res.json(careers);
  } catch (err) {
    next(err);
  }
});

// GET /api/discover/missing-skills?student=Anjali&career=Data%20Analyst
router.get('/missing-skills', async (req, res, next) => {
  try {
    const { student, career } = req.query;
    if (!student || !career) {
      return res.status(400).json({ error: 'student and career query parameters are required.' });
    }
    const skills = await findMissingSkills(student, career);
    res.json(skills);
  } catch (err) {
    next(err);
  }
});

// GET /api/discover/students-by-skill?skill=Python
router.get('/students-by-skill', async (req, res, next) => {
  try {
    const { skill } = req.query;
    if (!skill) return res.status(400).json({ error: 'skill query parameter is required.' });
    const result = await findStudentsAndProjectsBySkill(skill);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/discover/companies?skill=Python
router.get('/companies', async (req, res, next) => {
  try {
    const { skill } = req.query;
    if (!skill) return res.status(400).json({ error: 'skill query parameter is required.' });
    const companies = await findCompaniesBySkill(skill);
    res.json(companies);
  } catch (err) {
    next(err);
  }
});

// GET /api/discover/graph?student=Anjali
router.get('/graph', async (req, res, next) => {
  try {
    const { student } = req.query;
    if (!student) return res.status(400).json({ error: 'student query parameter is required.' });
    const graph = await getStudentGraph(student);
    res.json(graph);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
