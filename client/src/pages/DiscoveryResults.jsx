// client/src/pages/DiscoveryResults.jsx
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  fetchStudents, fetchSkills, fetchCareers,
  discoverMentors, discoverProjects, discoverCareers,
  discoverMissingSkills, discoverCompanies
} from '../services/api';
import SkillBadge from '../components/SkillBadge';
import Loader from '../components/Loader';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

const MODES = [
  { key: 'mentors',  label: '🤝 Mentors',        desc: 'Find mentors for skills you want to learn' },
  { key: 'careers',  label: '🚀 Career Paths',    desc: 'Careers matching your current skills' },
  { key: 'missing',  label: '📚 Missing Skills',  desc: 'Skills you need for a target career' },
  { key: 'projects', label: '🛠️ Projects',        desc: 'Projects using a specific skill' },
  { key: 'companies',label: '🏢 Companies',       desc: 'Companies with students who have a skill' },
];

export default function DiscoveryResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [students,  setStudents]  = useState([]);
  const [skills,    setSkills]    = useState([]);
  const [careers,   setCareers]   = useState([]);

  const [mode,    setMode]    = useState(searchParams.get('mode')    || 'mentors');
  const [student, setStudent] = useState(searchParams.get('student') || '');
  const [skill,   setSkill]   = useState(searchParams.get('skill')   || '');
  const [career,  setCareer]  = useState(searchParams.get('career')  || '');

  const [results,  setResults]  = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  // Load option lists
  useEffect(() => {
    Promise.all([fetchStudents(), fetchSkills(), fetchCareers()]).then(([s, sk, c]) => {
      setStudents(s); setSkills(sk); setCareers(c);
      if (!student && s.length)  setStudent(s[0].name);
      if (!skill   && sk.length) setSkill(sk[0].name);
      if (!career  && c.length)  setCareer(c[0].name);
    }).catch(() => {});
  }, []);

  const runQuery = useCallback(async () => {
    setLoading(true); setError(null); setResults(null);
    try {
      let data;
      if (mode === 'mentors')   data = await discoverMentors(student, skill);
      else if (mode === 'careers')  data = await discoverCareers(student);
      else if (mode === 'missing')  data = await discoverMissingSkills(student, career);
      else if (mode === 'projects') data = await discoverProjects(skill);
      else if (mode === 'companies') data = await discoverCompanies(skill);
      setResults(data);
    } catch (e) {
      setError(e.response?.data?.error || 'Unable to connect to the graph database. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [mode, student, skill, career]);

  // Auto-run when params change from Dashboard
  useEffect(() => {
    const qMode = searchParams.get('mode');
    if (qMode && students.length && skills.length && careers.length) runQuery();
  }, [students, skills, careers]);

  return (
    <main className="page">
      <div className="container">
        <header className="page-header">
          <div className="badge-pill">🔍 Graph Discovery</div>
          <h1>Discover Connections</h1>
          <p>Explore multi-hop relationships in the campus skill network.</p>
        </header>

        {/* Mode Tabs */}
        <div style={{display:'flex', flexWrap:'wrap', gap:'0.5rem', marginBottom:'1.5rem', justifyContent:'center'}}>
          {MODES.map(m => (
            <button key={m.key}
              id={`mode-btn-${m.key}`}
              className={`btn ${mode === m.key ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => { setMode(m.key); setResults(null); }}>
              {m.label}
            </button>
          ))}
        </div>

        {/* Query Panel */}
        <div className="control-panel" style={{marginBottom:'2rem'}}>
          <div className="section-label">{MODES.find(m => m.key === mode)?.desc}</div>
          <div className="selectors-grid" style={{marginBottom:'1rem'}}>
            {(mode === 'mentors' || mode === 'careers' || mode === 'missing') && (
              <div className="form-group">
                <label className="form-label" htmlFor="discover-student">Student</label>
                <select id="discover-student" className="form-select"
                  value={student} onChange={e => setStudent(e.target.value)}>
                  {students.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                </select>
              </div>
            )}
            {(mode === 'mentors' || mode === 'projects' || mode === 'companies') && (
              <div className="form-group">
                <label className="form-label" htmlFor="discover-skill">Skill</label>
                <select id="discover-skill" className="form-select"
                  value={skill} onChange={e => setSkill(e.target.value)}>
                  {skills.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                </select>
              </div>
            )}
            {mode === 'missing' && (
              <div className="form-group">
                <label className="form-label" htmlFor="discover-career">Target Career</label>
                <select id="discover-career" className="form-select"
                  value={career} onChange={e => setCareer(e.target.value)}>
                  {careers.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>
            )}
          </div>
          <button id="btn-run-query" className="btn btn-primary btn-lg" onClick={runQuery} disabled={loading}>
            {loading ? '⏳ Querying graph…' : '🔍 Run Query'}
          </button>
        </div>

        {/* Results */}
        {loading && <Loader text="Traversing the graph…" />}
        {error   && <ErrorState message={error} onRetry={runQuery} />}

        {results && !loading && (
          <section aria-live="polite" aria-label="Query results">
            {results.length === 0
              ? <EmptyState icon="🕸️" title="No results found"
                  message="Try changing your selection or running the seed script to populate data." />
              : <div className="grid-2">
                  {/* ── Mentors ── */}
                  {mode === 'mentors' && results.map((r, i) => (
                    <article key={i} className="mentor-card">
                      <div style={{display:'flex', alignItems:'center', gap:'0.875rem'}}>
                        <div className="mentor-avatar">{r.mentor[0]}</div>
                        <div className="mentor-info">
                          <div className="mentor-name">{r.mentor}</div>
                          <div className="mentor-meta">Year {r.year} · {r.email}</div>
                        </div>
                      </div>
                      <div>
                        <div className="section-label" style={{marginBottom:'0.4rem'}}>Can teach</div>
                        <div className="tags-wrap">
                          {(r.sharedSkills || []).map(s => <SkillBadge key={s} name={s} variant="has" />)}
                        </div>
                      </div>
                    </article>
                  ))}

                  {/* ── Careers ── */}
                  {mode === 'careers' && results.map((r, i) => (
                    <article key={i} className="career-card">
                      <div className="career-name">🚀 {r.career}</div>
                      <div className="career-desc">{r.description}</div>
                      <div className="section-label" style={{marginBottom:'0.4rem'}}>Matching skills</div>
                      <div className="tags-wrap">
                        {(r.matchingSkills || []).map(s => <SkillBadge key={s} name={s} variant="has" />)}
                      </div>
                    </article>
                  ))}

                  {/* ── Missing Skills ── */}
                  {mode === 'missing' && results.map((r, i) => (
                    <article key={i} className="card">
                      <div style={{display:'flex', alignItems:'center', gap:'0.75rem'}}>
                        <SkillBadge name={r.missingSkill} variant="missing" />
                        <span style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>
                          {r.category}
                        </span>
                      </div>
                    </article>
                  ))}

                  {/* ── Projects ── */}
                  {mode === 'projects' && results.map((r, i) => (
                    <article key={i} className="project-card">
                      <div className="project-name">🛠️ {r.project}</div>
                      <div className="project-desc">{r.description}</div>
                    </article>
                  ))}

                  {/* ── Companies ── */}
                  {mode === 'companies' && results.map((r, i) => (
                    <article key={i} className="card">
                      <div style={{display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.75rem'}}>
                        <div className="card-icon green" aria-hidden="true">🏢</div>
                        <div>
                          <div className="card-title">{r.company}</div>
                          <div className="card-subtitle">{r.industry}</div>
                        </div>
                      </div>
                      <div className="section-label" style={{marginBottom:'0.4rem'}}>Students with this skill</div>
                      <div className="tags-wrap">
                        {(r.studentsWithSkill || []).map(s => (
                          <span key={s} className="graph-chip student">{s[0]} {s}</span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
            }

            <div style={{marginTop:'1rem', fontSize:'0.82rem', color:'var(--text-muted)', textAlign:'center'}}>
              {results.length} result{results.length !== 1 ? 's' : ''} from the graph database
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
