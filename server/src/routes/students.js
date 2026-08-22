// server/src/routes/students.js

const express = require('express');
const router  = express.Router();
const { getAllStudents, getStudentProfile } = require('../services/studentService');

// GET /api/students
router.get('/', async (req, res, next) => {
  try {
    const students = await getAllStudents();
    res.json(students);
  } catch (err) {
    next(err);
  }
});

// GET /api/students/:name/skills  (returns full profile)
router.get('/:name/skills', async (req, res, next) => {
  try {
    const { name } = req.params;
    if (!name) return res.status(400).json({ error: 'Student name is required.' });
    const profile = await getStudentProfile(name);
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
