// server/src/middleware/errorHandler.js
// Central error-handling middleware.

function errorHandler(err, req, res, next) {
  console.error('[ErrorHandler]', err.message);

  // Neo4j / CognoDB connection errors
  if (
    err.code === 'ServiceUnavailable' ||
    err.message?.toLowerCase().includes('connection')
  ) {
    return res.status(503).json({
      error: 'Unable to connect to the graph database. Please try again.',
    });
  }

  // Validation errors passed via next(err)
  if (err.status === 400) {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: 'An unexpected server error occurred.' });
}

module.exports = errorHandler;
