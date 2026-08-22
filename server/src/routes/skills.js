// server/src/routes/skills.js

const express = require('express');
const router  = express.Router();
const { getAllSkills } = require('../services/studentService');

// GET /api/skills
router.get('/', async (req, res, next) => {
  try {
    const skills = await getAllSkills();
    res.json(skills);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
