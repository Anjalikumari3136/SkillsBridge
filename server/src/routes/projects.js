// server/src/routes/projects.js

const express = require('express');
const router  = express.Router();
const { getAllProjects } = require('../services/studentService');

// GET /api/projects
router.get('/', async (req, res, next) => {
  try {
    const projects = await getAllProjects();
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
