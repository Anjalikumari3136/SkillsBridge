// server/src/utils/neo4j.js
// Neo4j driver v5 returns 64-bit integers as Neo4j Integer objects.
// Use neo4j.isInt() to detect them, then convert to plain JS numbers.

const neo4j = require('neo4j-driver');

function toPlain(value) {
  if (neo4j.isInt(value)) {
    return value.toNumber();
  }
  if (Array.isArray(value)) {
    return value.map(toPlain);
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, toPlain(v)])
    );
  }
  return value;
}

/** Convert a neo4j record's toObject() result to plain JS. */
function recordToPlain(record) {
  return toPlain(record.toObject());
}

module.exports = { toPlain, recordToPlain };
