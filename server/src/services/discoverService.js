// server/src/services/discoverService.js
// Graph traversal queries for discovery features.
// All queries use $param syntax – no string concatenation.

const { getSession } = require('../config/db');
const { recordToPlain } = require('../utils/neo4j');

/**
 * Query 5 – Recommended mentors based on skills a student wants to learn.
 * Multi-hop: student -[:WANTS_TO_LEARN]-> skill <-[:HAS_SKILL]- mentor
 */
async function findMentors(student, skill) {
  const session = getSession();
  try {
    let query, params;

    if (skill) {
      // Filter by a specific skill the student wants to learn
      query = `
        MATCH (s:Student {name: $student})-[:WANTS_TO_LEARN]->(sk:Skill {name: $skill})<-[:HAS_SKILL]-(mentor:Student)
        WHERE mentor.name <> $student
        RETURN DISTINCT mentor.name AS mentor,
               collect(sk.name) AS sharedSkills,
               mentor.email AS email, mentor.year AS year
      `;
      params = { student, skill };
    } else {
      query = `
        MATCH (s:Student {name: $student})-[:WANTS_TO_LEARN]->(sk:Skill)<-[:HAS_SKILL]-(mentor:Student)
        WHERE mentor.name <> $student
        RETURN DISTINCT mentor.name AS mentor,
               collect(sk.name) AS sharedSkills,
               mentor.email AS email, mentor.year AS year
      `;
      params = { student };
    }

    const result = await session.run(query, params);
    return result.records.map(recordToPlain);
  } finally {
    await session.close();
  }
}

/**
 * Query 6 – Projects related to a specific skill.
 */
async function findProjects(skill) {
  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (p:Project)-[:USES_SKILL]->(sk:Skill {name: $skill})
       RETURN p.name AS project, p.description AS description`,
      { skill }
    );
    return result.records.map(recordToPlain);
  } finally {
    await session.close();
  }
}

/**
 * Query 3 – Careers connected to a student's existing skills.
 * Multi-hop: student -[:HAS_SKILL]-> skill -[:RELEVANT_FOR]-> career
 */
async function findCareers(student) {
  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (s:Student {name: $student})-[:HAS_SKILL]->(sk:Skill)-[:RELEVANT_FOR]->(c:Career)
       RETURN DISTINCT c.name AS career, c.description AS description,
              collect(sk.name) AS matchingSkills`,
      { student }
    );
    return result.records.map(recordToPlain);
  } finally {
    await session.close();
  }
}

/**
 * Query 4 – Skills required for a career that the student does NOT have.
 * Multi-hop: career <-[:RELEVANT_FOR]- skill (filter: student lacks skill)
 */
async function findMissingSkills(student, career) {
  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (c:Career {name: $career})<-[:RELEVANT_FOR]-(sk:Skill)
       WHERE NOT EXISTS {
         MATCH (s:Student {name: $student})-[:HAS_SKILL]->(sk)
       }
       RETURN sk.name AS missingSkill, sk.category AS category`,
      { student, career }
    );
    return result.records.map(recordToPlain);
  } finally {
    await session.close();
  }
}

/**
 * Query 2 – Students + projects using a specific skill (multi-hop traversal).
 * Traversal: Student -[:HAS_SKILL]-> Skill <-[:USES_SKILL]- Project
 *            Student -[:WORKED_ON]-> Project
 */
async function findStudentsAndProjectsBySkill(skill) {
  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (s:Student)-[:HAS_SKILL]->(sk:Skill {name: $skill})
       MATCH (s)-[:WORKED_ON]->(p:Project)-[:USES_SKILL]->(sk)
       RETURN s.name AS student, p.name AS project, p.description AS description`,
      { skill }
    );
    return result.records.map(recordToPlain);
  } finally {
    await session.close();
  }
}

/**
 * Query 7 – Companies connected to students with a particular skill.
 * 2-hop: Company <-[:WORKS_AT]- Student -[:HAS_SKILL]-> Skill
 */
async function findCompaniesBySkill(skill) {
  const session = getSession();
  try {
    const result = await session.run(
      `MATCH (co:Company)<-[:WORKS_AT]-(s:Student)-[:HAS_SKILL]->(sk:Skill {name: $skill})
       RETURN DISTINCT co.name AS company, co.industry AS industry,
              collect(s.name) AS studentsWithSkill`,
      { skill }
    );
    return result.records.map(recordToPlain);
  } finally {
    await session.close();
  }
}

/**
 * Graph Explorer – fetch student's full connected graph path.
 * Student → Skill → Project → Career
 */
async function getStudentGraph(student) {
  const session = getSession();
  try {
    const skillsRes = await session.run(
      'MATCH (s:Student {name: $student})-[:HAS_SKILL]->(sk:Skill) RETURN sk.name AS name, sk.category AS category',
      { student }
    );
    const projectsRes = await session.run(
      `MATCH (s:Student {name: $student})-[:WORKED_ON]->(p:Project)
       OPTIONAL MATCH (p)-[:USES_SKILL]->(sk:Skill)
       RETURN p.name AS name, p.description AS description, collect(sk.name) AS skills`,
      { student }
    );
    const careersRes = await session.run(
      `MATCH (s:Student {name: $student})-[:HAS_SKILL]->(sk:Skill)-[:RELEVANT_FOR]->(c:Career)
       RETURN DISTINCT c.name AS name, c.description AS description`,
      { student }
    );
    const companiesRes = await session.run(
      'MATCH (s:Student {name: $student})-[:WORKS_AT]->(co:Company) RETURN co.name AS name, co.industry AS industry',
      { student }
    );
    const wantRes = await session.run(
      'MATCH (s:Student {name: $student})-[:WANTS_TO_LEARN]->(sk:Skill) RETURN sk.name AS name, sk.category AS category',
      { student }
    );

    return {
      student,
      skills:      skillsRes.records.map(recordToPlain),
      projects:    projectsRes.records.map(recordToPlain),
      careers:     careersRes.records.map(recordToPlain),
      companies:   companiesRes.records.map(recordToPlain),
      wantToLearn: wantRes.records.map(recordToPlain),
    };
  } finally {
    await session.close();
  }
}

module.exports = {
  findMentors,
  findProjects,
  findCareers,
  findMissingSkills,
  findStudentsAndProjectsBySkill,
  findCompaniesBySkill,
  getStudentGraph,
};
