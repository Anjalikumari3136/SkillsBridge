const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const neo4j = require('neo4j-driver');

const URI      = process.env.COGNODB_URI;
const USERNAME = process.env.COGNODB_USERNAME;
const PASSWORD = process.env.COGNODB_PASSWORD;

if (!URI || !USERNAME || !PASSWORD) {
  console.error('❌  COGNODB_URI, COGNODB_USERNAME, and COGNODB_PASSWORD must be set in .env');
  process.exit(1);
}

const driver = neo4j.driver(URI, neo4j.auth.basic(USERNAME, PASSWORD));

/** Returns a new driver session. Caller must close it. */
function getSession() {
  return driver.session();
}

/** Verify connectivity – called once on startup. */
async function verifyConnectivity() {
  await driver.verifyConnectivity();
  console.log('✅  Connected to CognoDB at', URI);
}

/** Graceful shutdown. */
async function closeDriver() {
  await driver.close();
}

module.exports = { getSession, verifyConnectivity, closeDriver };
