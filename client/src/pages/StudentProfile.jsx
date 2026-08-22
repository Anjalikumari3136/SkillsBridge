// client/src/pages/StudentProfile.jsx
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchStudentProfile, fetchStudents } from '../services/api';
import SkillBadge from '../components/SkillBadge';
import Loader from '../components/Loader';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

export default function StudentProfile() {
  const [params]   = useSearchParams();
  const navigate   = useNavigate();
  const [students, setStudents] = useState([]);
  const [student,  setStudent]  = useState(params.get('student') || '');
  const [profile,  setProfile]  = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  // Load student list for selector
  useEffect(() => {
    fetchStudents().then(s => {
      setStudents(s);
      if (!student && s.length) setStudent(s[0].name);
    }).catch(() => {});
  }, []);

  const loadProfile = async (name) => {
    if (!name) return;
    setLoading(true); setError(null); setProfile(null);
    try {
      const data = await fetchStudentProfile(name);
      setProfile(data);
    } catch (e) {
      setError(e.response?.data?.error || 'Unable to connect to the graph database. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (student) loadProfile(student); }, [student]);

  const handleChange = (e) => {
    const name = e.target.value;
    setStudent(name);
    navigate(`/profile?student=${encodeURIComponent(name)}`, { replace: true });
  };

  return (
    <main className="page">
      <div className="container">
        <header className="page-header">
          <div className="badge-pill">👤 Student Profile</div>
          <h1>Skill Network</h1>
          <p>Explore a student's skills, projects they've worked on, and career connections.</p>
        </header>

        {/* Student Selector */}
        <div style={{maxWidth:320, margin:'0 auto 2rem'}}>
          <div className="form-group">
            <label className="form-label" htmlFor="profile-student-select">Select Student</label>
            <select id="profile-student-select" className="form-select"
              value={student} onChange={handleChange}>
              {students.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
            </select>
          </div>
        </div>

        {loading && <Loader text={`Loading ${student}'s profile…`} />}
        {error   && <ErrorState message={error} onRetry={() => loadProfile(student)} />}

        {profile && !loading && (
          <>
            {/* Profile Hero */}
            <div className="profile-hero">
              <div className="profile-avatar" aria-hidden="true">{profile.name[0]}</div>
              <div>
                <div className="profile-name">{profile.name}</div>
                <div className="profile-meta">
                  {profile.companies.length > 0
                    ? profile.companies.map(c => (
                        <span key={c.name} className="company-chip" style={{marginRight:'0.5rem'}}>
                          🏢 {c.name} · {c.industry}
                        </span>
                      ))
                    : <span style={{color:'var(--text-muted)'}}>No company listed</span>}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="stats-strip">
              <div className="stat-box">
                <div className="stat-num">{profile.skills.length}</div>
                <div className="stat-label">Skills</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">{profile.wantToLearn.length}</div>
                <div className="stat-label">Want to Learn</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">{profile.projects.length}</div>
                <div className="stat-label">Projects</div>
              </div>
            </div>

            <div className="grid-2">
              {/* Skills */}
              <section className="card" aria-label="Current skills">
                <div className="card-header">
                  <div className="card-icon purple" aria-hidden="true">⚡</div>
                  <div>
                    <div className="card-title">Current Skills</div>
                    <div className="card-subtitle">Skills {profile.name} already has</div>
                  </div>
                </div>
                {profile.skills.length === 0
                  ? <EmptyState icon="📭" title="No skills listed" />
                  : <div className="tags-wrap">
                      {profile.skills.map(s => <SkillBadge key={s.name} name={s.name} variant="has" />)}
                    </div>}
              </section>

              {/* Want to Learn */}
              <section className="card" aria-label="Skills to learn">
                <div className="card-header">
                  <div className="card-icon orange" aria-hidden="true">🌱</div>
                  <div>
                    <div className="card-title">Wants to Learn</div>
                    <div className="card-subtitle">Skills {profile.name} is targeting</div>
                  </div>
                </div>
                {profile.wantToLearn.length === 0
                  ? <EmptyState icon="📭" title="Nothing listed" />
                  : <div className="tags-wrap">
                      {profile.wantToLearn.map(s => <SkillBadge key={s.name} name={s.name} variant="want" />)}
                    </div>}
              </section>
            </div>

            {/* Projects */}
            <section style={{marginTop:'1.25rem'}} aria-label="Projects">
              <div className="section-title" style={{marginBottom:'1rem'}}>🛠️ Projects</div>
              {profile.projects.length === 0
                ? <EmptyState icon="📁" title="No projects yet" />
                : <div className="grid-2">
                    {profile.projects.map(p => (
                      <article key={p.name} className="project-card">
                        <div className="project-name">{p.name}</div>
                        <div className="project-desc">{p.description}</div>
                      </article>
                    ))}
                  </div>}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
