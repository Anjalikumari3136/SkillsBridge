// server/src/routes/careers.js

const express = require('express');
const router  = express.Router();
const { getAllCareers } = require('../services/studentService');

// GET /api/careers
router.get('/', async (req, res, next) => {
  try {
    const careers = await getAllCareers();
    res.json(careers);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
