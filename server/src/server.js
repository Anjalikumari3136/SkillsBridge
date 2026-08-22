// server/src/server.js – SkillsBridge

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const express      = require('express');
const cors         = require('cors');
const { verifyConnectivity, closeDriver } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const studentsRouter = require('./routes/students');
const skillsRouter   = require('./routes/skills');
const careersRouter  = require('./routes/careers');
const projectsRouter = require('./routes/projects');
const discoverRouter = require('./routes/discover');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/students', studentsRouter);
app.use('/api/skills',   skillsRouter);
app.use('/api/careers',  careersRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/discover', discoverRouter);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ─── Central error handler ────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
async function start() {
  try {
    await verifyConnectivity();
    const server = app.listen(PORT, () => {
      console.log(`🚀  SkillsBridge server running on http://localhost:${PORT}`);
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌  Port ${PORT} is already in use. Stop the other process first.`);
      } else {
        console.error('❌  Server error:', err.message);
      }
      process.exit(1);
    });
  } catch (err) {
    console.error('❌  Failed to connect to CognoDB:', err.message);
    console.error('    Make sure COGNODB_URI, COGNODB_USERNAME and COGNODB_PASSWORD are set in .env');
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  await closeDriver();
  process.exit(0);
});

start();
