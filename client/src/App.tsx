import './App.css';
import DbStatus from './components/DbStatus.tsx';
import RunsTable from './components/RunsTable';
import ProjectsTable from './components/ProjectsTable';

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <span className="nav-title">ML Experiment Tracker</span>
        <div className="nav-links">
          <a href="#projects">Projects</a>
          <a href="#runs">Runs</a>
          <a href="#hyperparameters">Hyperparameters</a>
          <a href="#search">Search</a>
          <a href="#analytics">Analytics</a>
        </div>
        <DbStatus />
      </nav>

      <main className="main-content">
        <section id="projects" className="section">
          <h2>Projects</h2>
          <p className="section-desc">All projects in the system.</p>
          <ProjectsTable />
        </section>

        <section id="runs" className="section">
          <h2>Runs</h2>
          <p className="section-desc">View, log, and delete experiment runs.</p>
          <RunsTable />
        </section>

        <section id="hyperparameters" className="section">
          <h2>Hyperparameters</h2>
          <p className="section-desc">
            View and update hyperparameter definitions.
          </p>
        </section>

        <section id="search" className="section">
          <h2>Search</h2>
          <p className="section-desc">
            Filter runs by any combination of conditions.
          </p>
        </section>

        <section id="analytics" className="section">
          <h2>Analytics</h2>
          <p className="section-desc">Explore trends across experiments.</p>
        </section>
      </main>
    </div>
  );
}

export default App;
