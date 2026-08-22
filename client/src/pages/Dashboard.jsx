// client/src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStudents, fetchSkills, fetchCareers } from '../services/api';
import Loader from '../components/Loader';
import ErrorState from '../components/ErrorState';

export default function Dashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [skills,   setSkills]   = useState([]);
  const [careers,  setCareers]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSkill,   setSelectedSkill]   = useState('');
  const [selectedCareer,  setSelectedCareer]  = useState('');

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const [s, sk, c] = await Promise.all([fetchStudents(), fetchSkills(), fetchCareers()]);
      setStudents(s); setSkills(sk); setCareers(c);
      if (s.length)  setSelectedStudent(s[0].name);
      if (sk.length) setSelectedSkill(sk[0].name);
      if (c.length)  setSelectedCareer(c[0].name);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const go = (path) => navigate(path);

  return (
    <main className="page">
      <div className="container">
        {/* Hero */}
        <header className="page-header">
          <div className="badge-pill">🌉 Graph-Powered Mentorship</div>
          <h1>SkillsBridge</h1>
          <p>
            Discover connections between students, skills, projects, and career paths
            through the power of a graph database.
          </p>
        </header>

        {loading && <Loader text="Loading campus data…" />}
        {error   && <ErrorState message={error} onRetry={load} />}

        {!loading && !error && (
          <>
            {/* Control Panel */}
            <section className="control-panel" aria-label="Selection panel">
              <div className="section-label">Select to Explore</div>
              <div className="selectors-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="select-student">Student</label>
                  <select id="select-student" className="form-select"
                    value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}>
                    {students.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="select-skill">Skill</label>
                  <select id="select-skill" className="form-select"
                    value={selectedSkill} onChange={e => setSelectedSkill(e.target.value)}>
                    {skills.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="select-career">Career</label>
                  <select id="select-career" className="form-select"
                    value={selectedCareer} onChange={e => setSelectedCareer(e.target.value)}>
                    {careers.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="action-btns">
                <button id="btn-view-profile" className="btn btn-primary"
                  onClick={() => go(`/profile?student=${encodeURIComponent(selectedStudent)}`)}>
                  👤 View Profile
                </button>
                <button id="btn-find-mentors" className="btn btn-accent"
                  onClick={() => go(`/discover?student=${encodeURIComponent(selectedStudent)}&skill=${encodeURIComponent(selectedSkill)}&mode=mentors`)}>
                  🤝 Find Mentors
                </button>
                <button id="btn-career-paths" className="btn btn-ghost"
                  onClick={() => go(`/discover?student=${encodeURIComponent(selectedStudent)}&career=${encodeURIComponent(selectedCareer)}&mode=careers`)}>
                  🚀 Career Paths
                </button>
                <button id="btn-missing-skills" className="btn btn-ghost"
                  onClick={() => go(`/discover?student=${encodeURIComponent(selectedStudent)}&career=${encodeURIComponent(selectedCareer)}&mode=missing`)}>
                  📚 Missing Skills
                </button>
                <button id="btn-related-projects" className="btn btn-ghost"
                  onClick={() => go(`/discover?skill=${encodeURIComponent(selectedSkill)}&mode=projects`)}>
                  🛠️ Related Projects
                </button>
                <button id="btn-explore-graph" className="btn btn-ghost"
                  onClick={() => go(`/explorer?student=${encodeURIComponent(selectedStudent)}`)}>
                  🕸️ Graph Explorer
                </button>
              </div>
            </section>

            {/* Stats */}
            <section aria-label="Database stats">
              <div className="stats-strip">
                <div className="stat-box">
                  <div className="stat-num">{students.length}</div>
                  <div className="stat-label">Students</div>
                </div>
                <div className="stat-box">
                  <div className="stat-num">{skills.length}</div>
                  <div className="stat-label">Skills</div>
                </div>
                <div className="stat-box">
                  <div className="stat-num">{careers.length}</div>
                  <div className="stat-label">Careers</div>
                </div>
              </div>
            </section>

            {/* Student Cards */}
            <section aria-label="Student list">
              <div className="section-title" style={{marginBottom:'1rem'}}>All Students</div>
              <div className="grid-3">
                {students.map(s => (
                  <article key={s.name} className="card" style={{cursor:'pointer'}}
                    onClick={() => go(`/profile?student=${encodeURIComponent(s.name)}`)}>
                    <div style={{display:'flex', alignItems:'center', gap:'0.875rem'}}>
                      <div className="mentor-avatar">{s.name[0]}</div>
                      <div>
                        <div style={{fontWeight:700}}>{s.name}</div>
                        <div style={{fontSize:'0.82rem',color:'var(--text-muted)'}}>Year {s.year} · {s.email}</div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
