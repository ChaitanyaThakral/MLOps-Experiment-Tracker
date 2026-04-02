import './App.css';
import DbStatus from './components/DbStatus.tsx';
import RunsTable from './components/RunsTable';
import ProjectsTable from './components/ProjectsTable';
import { useState } from 'react';
import LogRunForm from './components/LogRunForm.tsx';
import HyperparameterTable from './components/HyperparameterTable';
import RunSelection from './components/RunSelection';
import RunProjection from './components/RunProjection';
import RunsMetricsJoin from './components/RunsMetricsJoin.tsx';

function App() {
  // Incrementing triggers RunsTable to re-fetch
  const [runsRefreshKey, setRunsRefreshKey] = useState(0);
  const refreshRuns = () => setRunsRefreshKey((k) => k + 1);

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
          <RunsTable refreshKey={runsRefreshKey} />
          <LogRunForm onSuccess={refreshRuns} />
        </section>

        <section id="hyperparameters" className="section">
          <h2>Hyperparameters</h2>
          <p className="section-desc">
            View and update hyperparameter definitions.
          </p>
          <HyperparameterTable />
        </section>

        <section id="search" className="section">
          <h2>Search</h2>
          <p className="section-desc">
            Filter runs by any combination of conditions, or choose which
            columns to display.
          </p>
          <RunSelection />
          <RunProjection />
          <RunsMetricsJoin />
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
