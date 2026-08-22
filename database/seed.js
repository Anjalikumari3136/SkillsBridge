// database/seed.js
// Run with: node seed.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const neo4j = require('neo4j-driver');

const URI      = process.env.COGNODB_URI;
const USERNAME = process.env.COGNODB_USERNAME;
const PASSWORD = process.env.COGNODB_PASSWORD;

if (!URI || !USERNAME || !PASSWORD) {
  console.error('❌  Missing COGNODB_URI, COGNODB_USERNAME, or COGNODB_PASSWORD in .env');
  process.exit(1);
}

const driver = neo4j.driver(URI, neo4j.auth.basic(USERNAME, PASSWORD));

async function seed() {
  const session = driver.session();
  try {
    console.log('🌱  Seeding CognoDB …');

    // ─── Students ────────────────────────────────────────────────────────────
    await session.run(`
      MERGE (s:Student {name: 'Anjali'})
        SET s.email = 'anjali@campus.edu', s.year = 3
      MERGE (s2:Student {name: 'Rahul'})
        SET s2.email = 'rahul@campus.edu', s2.year = 2
      MERGE (s3:Student {name: 'Priya'})
        SET s3.email = 'priya@campus.edu', s3.year = 4
      MERGE (s4:Student {name: 'Aman'})
        SET s4.email = 'aman@campus.edu', s4.year = 1
      MERGE (s5:Student {name: 'Sneha'})
        SET s5.email = 'sneha@campus.edu', s5.year = 3
    `);

    // ─── Skills ──────────────────────────────────────────────────────────────
    await session.run(`
      MERGE (:Skill {name: 'SQL',            category: 'Data'})
      MERGE (:Skill {name: 'Python',         category: 'Programming'})
      MERGE (:Skill {name: 'React',          category: 'Frontend'})
      MERGE (:Skill {name: 'Node.js',        category: 'Backend'})
      MERGE (:Skill {name: 'MongoDB',        category: 'Database'})
      MERGE (:Skill {name: 'Docker',         category: 'DevOps'})
      MERGE (:Skill {name: 'AWS',            category: 'Cloud'})
      MERGE (:Skill {name: 'Power BI',       category: 'Data'})
      MERGE (:Skill {name: 'Java',           category: 'Programming'})
      MERGE (:Skill {name: 'Machine Learning', category: 'AI/ML'})
    `);

    // ─── Projects ────────────────────────────────────────────────────────────
    await session.run(`
      MERGE (:Project {name: 'Sales Dashboard',                description: 'Interactive sales analytics dashboard with KPIs and trend charts.'})
      MERGE (:Project {name: 'Food Waste Management Platform', description: 'Platform to reduce food waste by connecting donors and NGOs.'})
      MERGE (:Project {name: 'E-Commerce API',                 description: 'RESTful API powering an online shopping platform.'})
      MERGE (:Project {name: 'Student Management System',      description: 'Web app to manage student records, grades, and attendance.'})
      MERGE (:Project {name: 'Resume Analyzer',                description: 'ML tool that parses and scores resumes against job descriptions.'})
      MERGE (:Project {name: 'Inventory Analytics Dashboard',  description: 'Real-time inventory tracking and analytics dashboard.'})
    `);

    // ─── Careers ─────────────────────────────────────────────────────────────
    await session.run(`
      MERGE (:Career {name: 'Data Analyst',        description: 'Analyse data to drive business decisions.'})
      MERGE (:Career {name: 'Backend Developer',   description: 'Build server-side APIs and services.'})
      MERGE (:Career {name: 'Frontend Developer',  description: 'Build user interfaces and web experiences.'})
      MERGE (:Career {name: 'Full Stack Developer',description: 'Work across frontend and backend.'})
      MERGE (:Career {name: 'Data Engineer',       description: 'Design and build data pipelines and infrastructure.'})
    `);

    // ─── Companies ───────────────────────────────────────────────────────────
    await session.run(`
      MERGE (:Company {name: 'Wexa',      industry: 'Technology'})
      MERGE (:Company {name: 'NIQ',       industry: 'Data & Analytics'})
      MERGE (:Company {name: 'Google',    industry: 'Technology'})
      MERGE (:Company {name: 'Microsoft', industry: 'Technology'})
      MERGE (:Company {name: 'Amazon',    industry: 'E-Commerce / Cloud'})
    `);

    // ─── HAS_SKILL relationships ──────────────────────────────────────────────
    await session.run(`
      MATCH (anjali:Student {name:'Anjali'}),    (sql:Skill     {name:'SQL'}),
            (python:Skill {name:'Python'}),      (powerbi:Skill {name:'Power BI'})
      MERGE (anjali)-[:HAS_SKILL]->(sql)
      MERGE (anjali)-[:HAS_SKILL]->(python)
      MERGE (anjali)-[:HAS_SKILL]->(powerbi)
    `);
    await session.run(`
      MATCH (rahul:Student {name:'Rahul'}),
            (node:Skill {name:'Node.js'}), (mongo:Skill {name:'MongoDB'}),
            (docker:Skill {name:'Docker'})
      MERGE (rahul)-[:HAS_SKILL]->(node)
      MERGE (rahul)-[:HAS_SKILL]->(mongo)
      MERGE (rahul)-[:HAS_SKILL]->(docker)
    `);
    await session.run(`
      MATCH (priya:Student {name:'Priya'}),
            (react:Skill {name:'React'}), (node:Skill {name:'Node.js'}),
            (python:Skill {name:'Python'})
      MERGE (priya)-[:HAS_SKILL]->(react)
      MERGE (priya)-[:HAS_SKILL]->(node)
      MERGE (priya)-[:HAS_SKILL]->(python)
    `);
    await session.run(`
      MATCH (aman:Student {name:'Aman'}),
            (java:Skill {name:'Java'}), (sql:Skill {name:'SQL'}),
            (docker:Skill {name:'Docker'})
      MERGE (aman)-[:HAS_SKILL]->(java)
      MERGE (aman)-[:HAS_SKILL]->(sql)
      MERGE (aman)-[:HAS_SKILL]->(docker)
    `);
    await session.run(`
      MATCH (sneha:Student {name:'Sneha'}),
            (ml:Skill {name:'Machine Learning'}), (python:Skill {name:'Python'}),
            (aws:Skill {name:'AWS'})
      MERGE (sneha)-[:HAS_SKILL]->(ml)
      MERGE (sneha)-[:HAS_SKILL]->(python)
      MERGE (sneha)-[:HAS_SKILL]->(aws)
    `);

    // ─── WANTS_TO_LEARN relationships ─────────────────────────────────────────
    await session.run(`
      MATCH (anjali:Student {name:'Anjali'}), (ml:Skill {name:'Machine Learning'}),
            (aws:Skill {name:'AWS'})
      MERGE (anjali)-[:WANTS_TO_LEARN]->(ml)
      MERGE (anjali)-[:WANTS_TO_LEARN]->(aws)
    `);
    await session.run(`
      MATCH (rahul:Student {name:'Rahul'}), (aws:Skill {name:'AWS'}),
            (python:Skill {name:'Python'})
      MERGE (rahul)-[:WANTS_TO_LEARN]->(aws)
      MERGE (rahul)-[:WANTS_TO_LEARN]->(python)
    `);
    await session.run(`
      MATCH (aman:Student {name:'Aman'}), (react:Skill {name:'React'}),
            (ml:Skill {name:'Machine Learning'})
      MERGE (aman)-[:WANTS_TO_LEARN]->(react)
      MERGE (aman)-[:WANTS_TO_LEARN]->(ml)
    `);
    await session.run(`
      MATCH (sneha:Student {name:'Sneha'}), (docker:Skill {name:'Docker'}),
            (node:Skill {name:'Node.js'})
      MERGE (sneha)-[:WANTS_TO_LEARN]->(docker)
      MERGE (sneha)-[:WANTS_TO_LEARN]->(node)
    `);

    // ─── WORKED_ON relationships ──────────────────────────────────────────────
    await session.run(`
      MATCH (anjali:Student {name:'Anjali'}),
            (dash:Project {name:'Sales Dashboard'}),
            (inv:Project  {name:'Inventory Analytics Dashboard'})
      MERGE (anjali)-[:WORKED_ON]->(dash)
      MERGE (anjali)-[:WORKED_ON]->(inv)
    `);
    await session.run(`
      MATCH (rahul:Student {name:'Rahul'}),
            (ecom:Project {name:'E-Commerce API'}),
            (food:Project {name:'Food Waste Management Platform'})
      MERGE (rahul)-[:WORKED_ON]->(ecom)
      MERGE (rahul)-[:WORKED_ON]->(food)
    `);
    await session.run(`
      MATCH (priya:Student {name:'Priya'}),
            (sms:Project  {name:'Student Management System'}),
            (ecom:Project {name:'E-Commerce API'})
      MERGE (priya)-[:WORKED_ON]->(sms)
      MERGE (priya)-[:WORKED_ON]->(ecom)
    `);
    await session.run(`
      MATCH (aman:Student {name:'Aman'}),
            (sms:Project {name:'Student Management System'})
      MERGE (aman)-[:WORKED_ON]->(sms)
    `);
    await session.run(`
      MATCH (sneha:Student {name:'Sneha'}),
            (resume:Project {name:'Resume Analyzer'}),
            (dash:Project   {name:'Sales Dashboard'})
      MERGE (sneha)-[:WORKED_ON]->(resume)
      MERGE (sneha)-[:WORKED_ON]->(dash)
    `);

    // ─── USES_SKILL relationships (Project → Skill) ───────────────────────────
    await session.run(`
      MATCH (dash:Project {name:'Sales Dashboard'}),
            (sql:Skill {name:'SQL'}), (powerbi:Skill {name:'Power BI'}),
            (python:Skill {name:'Python'})
      MERGE (dash)-[:USES_SKILL]->(sql)
      MERGE (dash)-[:USES_SKILL]->(powerbi)
      MERGE (dash)-[:USES_SKILL]->(python)
    `);
    await session.run(`
      MATCH (food:Project {name:'Food Waste Management Platform'}),
            (node:Skill {name:'Node.js'}), (mongo:Skill {name:'MongoDB'}),
            (react:Skill {name:'React'})
      MERGE (food)-[:USES_SKILL]->(node)
      MERGE (food)-[:USES_SKILL]->(mongo)
      MERGE (food)-[:USES_SKILL]->(react)
    `);
    await session.run(`
      MATCH (ecom:Project {name:'E-Commerce API'}),
            (node:Skill {name:'Node.js'}), (mongo:Skill {name:'MongoDB'}),
            (docker:Skill {name:'Docker'})
      MERGE (ecom)-[:USES_SKILL]->(node)
      MERGE (ecom)-[:USES_SKILL]->(mongo)
      MERGE (ecom)-[:USES_SKILL]->(docker)
    `);
    await session.run(`
      MATCH (sms:Project {name:'Student Management System'}),
            (java:Skill {name:'Java'}), (sql:Skill {name:'SQL'}),
            (react:Skill {name:'React'})
      MERGE (sms)-[:USES_SKILL]->(java)
      MERGE (sms)-[:USES_SKILL]->(sql)
      MERGE (sms)-[:USES_SKILL]->(react)
    `);
    await session.run(`
      MATCH (resume:Project {name:'Resume Analyzer'}),
            (python:Skill {name:'Python'}), (ml:Skill {name:'Machine Learning'})
      MERGE (resume)-[:USES_SKILL]->(python)
      MERGE (resume)-[:USES_SKILL]->(ml)
    `);
    await session.run(`
      MATCH (inv:Project {name:'Inventory Analytics Dashboard'}),
            (sql:Skill {name:'SQL'}), (powerbi:Skill {name:'Power BI'}),
            (aws:Skill {name:'AWS'})
      MERGE (inv)-[:USES_SKILL]->(sql)
      MERGE (inv)-[:USES_SKILL]->(powerbi)
      MERGE (inv)-[:USES_SKILL]->(aws)
    `);

    // ─── RELEVANT_FOR relationships (Skill → Career) ──────────────────────────
    await session.run(`
      MATCH (sql:Skill {name:'SQL'}),         (da:Career {name:'Data Analyst'})
      MERGE (sql)-[:RELEVANT_FOR]->(da)
    `);
    await session.run(`
      MATCH (python:Skill {name:'Python'}),   (da:Career {name:'Data Analyst'}),
            (de:Career {name:'Data Engineer'}), (ml_career:Career {name:'Data Analyst'})
      MERGE (python)-[:RELEVANT_FOR]->(da)
      MERGE (python)-[:RELEVANT_FOR]->(de)
    `);
    await session.run(`
      MATCH (powerbi:Skill {name:'Power BI'}), (da:Career {name:'Data Analyst'})
      MERGE (powerbi)-[:RELEVANT_FOR]->(da)
    `);
    await session.run(`
      MATCH (node:Skill {name:'Node.js'}),    (be:Career {name:'Backend Developer'}),
            (fs:Career {name:'Full Stack Developer'})
      MERGE (node)-[:RELEVANT_FOR]->(be)
      MERGE (node)-[:RELEVANT_FOR]->(fs)
    `);
    await session.run(`
      MATCH (mongo:Skill {name:'MongoDB'}),   (be:Career {name:'Backend Developer'}),
            (fs:Career {name:'Full Stack Developer'})
      MERGE (mongo)-[:RELEVANT_FOR]->(be)
      MERGE (mongo)-[:RELEVANT_FOR]->(fs)
    `);
    await session.run(`
      MATCH (react:Skill {name:'React'}),     (fe:Career {name:'Frontend Developer'}),
            (fs:Career {name:'Full Stack Developer'})
      MERGE (react)-[:RELEVANT_FOR]->(fe)
      MERGE (react)-[:RELEVANT_FOR]->(fs)
    `);
    await session.run(`
      MATCH (docker:Skill {name:'Docker'}),   (de:Career {name:'Data Engineer'}),
            (be:Career {name:'Backend Developer'})
      MERGE (docker)-[:RELEVANT_FOR]->(de)
      MERGE (docker)-[:RELEVANT_FOR]->(be)
    `);
    await session.run(`
      MATCH (aws:Skill {name:'AWS'}),         (de:Career {name:'Data Engineer'}),
            (be:Career {name:'Backend Developer'})
      MERGE (aws)-[:RELEVANT_FOR]->(de)
      MERGE (aws)-[:RELEVANT_FOR]->(be)
    `);
    await session.run(`
      MATCH (ml:Skill {name:'Machine Learning'}), (da:Career {name:'Data Analyst'}),
            (de:Career {name:'Data Engineer'})
      MERGE (ml)-[:RELEVANT_FOR]->(da)
      MERGE (ml)-[:RELEVANT_FOR]->(de)
    `);
    await session.run(`
      MATCH (java:Skill {name:'Java'}),       (be:Career {name:'Backend Developer'}),
            (fs:Career {name:'Full Stack Developer'})
      MERGE (java)-[:RELEVANT_FOR]->(be)
      MERGE (java)-[:RELEVANT_FOR]->(fs)
    `);

    // ─── WORKS_AT relationships (Student → Company) ───────────────────────────
    await session.run(`
      MATCH (anjali:Student {name:'Anjali'}), (niq:Company {name:'NIQ'})
      MERGE (anjali)-[:WORKS_AT]->(niq)
    `);
    await session.run(`
      MATCH (rahul:Student {name:'Rahul'}), (wexa:Company {name:'Wexa'})
      MERGE (rahul)-[:WORKS_AT]->(wexa)
    `);
    await session.run(`
      MATCH (priya:Student {name:'Priya'}), (google:Company {name:'Google'})
      MERGE (priya)-[:WORKS_AT]->(google)
    `);
    await session.run(`
      MATCH (aman:Student {name:'Aman'}), (microsoft:Company {name:'Microsoft'})
      MERGE (aman)-[:WORKS_AT]->(microsoft)
    `);
    await session.run(`
      MATCH (sneha:Student {name:'Sneha'}), (amazon:Company {name:'Amazon'})
      MERGE (sneha)-[:WORKS_AT]->(amazon)
    `);

    console.log('✅  Seed complete. All nodes and relationships created/merged.');
  } catch (err) {
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
  } finally {
    await session.close();
    await driver.close();
  }
}

seed();
