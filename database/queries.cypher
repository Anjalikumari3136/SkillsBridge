// =============================================================================
// CampusConnect – Reference Cypher Queries
// All queries use $param syntax. Never concatenate user input into Cypher.
// =============================================================================

// ─── 1. Students who have a specific skill ───────────────────────────────────
MATCH (s:Student)-[:HAS_SKILL]->(sk:Skill {name: $skill})
RETURN s.name AS name, s.email AS email, s.year AS year;

// ─── 2. Students + projects where they used a specific skill (multi-hop) ─────
// Traversal: Student -[:HAS_SKILL]-> Skill <-[:USES_SKILL]- Project
//            Student -[:WORKED_ON]-> Project
MATCH (s:Student)-[:HAS_SKILL]->(sk:Skill {name: $skill})
MATCH (s)-[:WORKED_ON]->(p:Project)-[:USES_SKILL]->(sk)
RETURN s.name AS student, p.name AS project, p.description AS description;

// ─── 3. Careers connected to a student's existing skills ─────────────────────
MATCH (s:Student {name: $student})-[:HAS_SKILL]->(sk:Skill)-[:RELEVANT_FOR]->(c:Career)
RETURN DISTINCT c.name AS career, c.description AS description,
       collect(sk.name) AS matchingSkills;

// ─── 4. Missing skills for a career that the student does NOT have ────────────
MATCH (c:Career {name: $career})<-[:RELEVANT_FOR]-(sk:Skill)
WHERE NOT EXISTS {
  MATCH (s:Student {name: $student})-[:HAS_SKILL]->(sk)
}
RETURN sk.name AS missingSkill, sk.category AS category;

// ─── 5. Recommended mentors based on skills a student wants to learn ──────────
// Traversal: student -[:WANTS_TO_LEARN]-> skill <-[:HAS_SKILL]- mentor
MATCH (s:Student {name: $student})-[:WANTS_TO_LEARN]->(sk:Skill)<-[:HAS_SKILL]-(mentor:Student)
WHERE mentor.name <> $student
RETURN DISTINCT mentor.name AS mentor, collect(sk.name) AS sharedSkills;

// ─── 6. Projects related to a specific skill ──────────────────────────────────
MATCH (p:Project)-[:USES_SKILL]->(sk:Skill {name: $skill})
RETURN p.name AS project, p.description AS description;

// ─── 7. Companies connected to students with a particular skill ───────────────
// Traversal: Company <-[:WORKS_AT]- Student -[:HAS_SKILL]-> Skill
MATCH (co:Company)<-[:WORKS_AT]-(s:Student)-[:HAS_SKILL]->(sk:Skill {name: $skill})
RETURN DISTINCT co.name AS company, co.industry AS industry,
       collect(s.name) AS studentsWithSkill;
