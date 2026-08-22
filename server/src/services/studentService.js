// server/src/services/studentService.js
// Database queries for students, skills, careers, and projects.

const { getSession } = require('../config/db');
const { recordToPlain } = require('../utils/neo4j');

/** Return all students. */
async function getAllStudents() {
  const session = getSession();
  try {
    const result = await session.run(
      'MATCH (s:Student) RETURN s.name AS name, s.email AS email, s.year AS year ORDER BY s.name'
    );
    return result.records.map(recordToPlain);
  } finally {
    await session.close();
  }
}

/** Return all skills. */
async function getAllSkills() {
  const session = getSession();
  try {
    const result = await session.run(
      'MATCH (sk:Skill) RETURN sk.name AS name, sk.category AS category ORDER BY sk.name'
    );
    return result.records.map(recordToPlain);
  } finally {
    await session.close();
  }
}

/** Return all careers. */
async function getAllCareers() {
  const session = getSession();
  try {
    const result = await session.run(
      'MATCH (c:Career) RETURN c.name AS name, c.description AS description ORDER BY c.name'
    );
    return result.records.map(recordToPlain);
  } finally {
    await session.close();
  }
}

/** Return all projects. */
async function getAllProjects() {
  const session = getSession();
  try {
    const result = await session.run(
      'MATCH (p:Project) RETURN p.name AS name, p.description AS description ORDER BY p.name'
    );
    return result.records.map(recordToPlain);
  } finally {
    await session.close();
  }
}

/**
 * Return a student's skills, want-to-learn skills, projects, and company.
 * @param {string} name – student name
 */
async function getStudentProfile(name) {
  const session = getSession();
  try {
    const skillsRes = await session.run(
      'MATCH (s:Student {name: $name})-[:HAS_SKILL]->(sk:Skill) RETURN sk.name AS name, sk.category AS category',
      { name }
    );
    const wantRes = await session.run(
      'MATCH (s:Student {name: $name})-[:WANTS_TO_LEARN]->(sk:Skill) RETURN sk.name AS name, sk.category AS category',
      { name }
    );
    const projectsRes = await session.run(
      'MATCH (s:Student {name: $name})-[:WORKED_ON]->(p:Project) RETURN p.name AS name, p.description AS description',
      { name }
    );
    const companyRes = await session.run(
      'MATCH (s:Student {name: $name})-[:WORKS_AT]->(co:Company) RETURN co.name AS name, co.industry AS industry',
      { name }
    );

    return {
      name,
      skills:        skillsRes.records.map(recordToPlain),
      wantToLearn:   wantRes.records.map(recordToPlain),
      projects:      projectsRes.records.map(recordToPlain),
      companies:     companyRes.records.map(recordToPlain),
    };
  } finally {
    await session.close();
  }
}

module.exports = { getAllStudents, getAllSkills, getAllCareers, getAllProjects, getStudentProfile };
