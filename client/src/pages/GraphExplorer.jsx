// client/src/pages/GraphExplorer.jsx
// Card-based visual: Student → Skills → Projects → Careers → Companies
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchStudents, fetchStudentGraph } from '../services/api';
import Loader from '../components/Loader';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

export default function GraphExplorer() {
  const [searchParams] = useSearchParams();
  const [students, setStudents] = useState([]);
  const [student,  setStudent]  = useState(searchParams.get('student') || '');
  const [graph,    setGraph]    = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    fetchStudents().then(s => {
      setStudents(s);
      if (!student && s.length) setStudent(s[0].name);
    }).catch(() => {});
  }, []);

  const loadGraph = async (name) => {
    if (!name) return;
    setLoading(true); setError(null); setGraph(null);
    try {
      const data = await fetchStudentGraph(name);
      setGraph(data);
    } catch (e) {
      setError(e.response?.data?.error || 'Unable to connect to the graph database. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (student) loadGraph(student); }, [student]);

  const NodeGroup = ({ label, type, items, keyProp, labelProp, subProp }) => (
    <div className="graph-node-group">
      <div className="graph-node-type">{label}</div>
      {items.length === 0
        ? <span style={{color:'var(--text-muted)', fontSize:'0.85rem', paddingLeft:'0.5rem'}}>—</span>
        : <div className="graph-chips">
            {items.map((item, i) => (
              <div key={i} className={`graph-chip ${type}`}>
                <span>{item[labelProp]}</span>
                {subProp && item[subProp] && (
                  <span style={{opacity:0.65, fontSize:'0.75rem'}}>· {
                    Array.isArray(item[subProp]) ? item[subProp].join(', ') : item[subProp]
                  }</span>
                )}
              </div>
            ))}
          </div>
      }
    </div>
  );

  const Connector = ({ label }) => (
    <div className="graph-connector">{label}</div>
  );

  return (
    <main className="page">
      <div className="container">
        <header className="page-header">
          <div className="badge-pill">🕸️ Graph Explorer</div>
          <h1>Connection Graph</h1>
          <p>Visualise a student's full network path through skills, projects, and careers.</p>
        </header>

        {/* Student Selector */}
        <div style={{maxWidth:360, margin:'0 auto 2.5rem', display:'flex', gap:'0.75rem', alignItems:'flex-end'}}>
          <div className="form-group" style={{flex:1}}>
            <label className="form-label" htmlFor="explorer-student">Select Student</label>
            <select id="explorer-student" className="form-select"
              value={student} onChange={e => setStudent(e.target.value)}>
              {students.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <button id="btn-load-graph" className="btn btn-primary"
            onClick={() => loadGraph(student)} disabled={loading}>
            Load
          </button>
        </div>

        {loading && <Loader text="Building graph…" />}
        {error   && <ErrorState message={error} onRetry={() => loadGraph(student)} />}

        {graph && !loading && (
          <div className="card" style={{maxWidth:780, margin:'0 auto'}}>
            {/* Student Node */}
            <div style={{textAlign:'center', marginBottom:'1.5rem'}}>
              <div className="mentor-avatar" style={{margin:'0 auto 0.5rem', width:56, height:56, fontSize:'1.5rem'}}>{graph.student[0]}</div>
              <div style={{fontWeight:800, fontSize:'1.25rem'}}>{graph.student}</div>
              <div style={{color:'var(--text-muted)', fontSize:'0.82rem'}}>Student Node</div>
            </div>

            <div className="graph-path">
              <Connector label="HAS_SKILL →" />
              <NodeGroup label="⚡ Skills" type="skill"
                items={graph.skills} keyProp="name" labelProp="name" subProp="category" />

              <Connector label="WANTS_TO_LEARN →" />
              <NodeGroup label="🌱 Wants to Learn" type="skill"
                items={graph.wantToLearn} keyProp="name" labelProp="name" subProp="category" />

              <Connector label="WORKED_ON → (Project) -[USES_SKILL]→" />
              <NodeGroup label="🛠️ Projects" type="project"
                items={graph.projects} keyProp="name" labelProp="name" subProp="skills" />

              <Connector label="[Skill] -[RELEVANT_FOR]→" />
              <NodeGroup label="🚀 Career Paths" type="career"
                items={graph.careers} keyProp="name" labelProp="name" />

              <Connector label="WORKS_AT →" />
              <NodeGroup label="🏢 Companies" type="company"
                items={graph.companies} keyProp="name" labelProp="name" subProp="industry" />
            </div>

            {/* Legend */}
            <div className="divider" />
            <div style={{display:'flex', flexWrap:'wrap', gap:'0.5rem', fontSize:'0.78rem', color:'var(--text-muted)'}}>
              <span>Legend:</span>
              {[['skill','⚡ Skill'],['project','🛠️ Project'],['career','🚀 Career'],['company','🏢 Company']].map(([t,l]) => (
                <span key={t} className={`graph-chip ${t}`} style={{fontSize:'0.72rem', padding:'0.25rem 0.6rem'}}>{l}</span>
              ))}
            </div>
          </div>
        )}

        {!loading && !error && !graph && students.length > 0 && (
          <EmptyState icon="🕸️" title="Select a student" message="Choose a student above and click Load to explore their graph." />
        )}
      </div>
    </main>
  );
}
