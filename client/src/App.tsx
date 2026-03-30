import './App.css'
import DbStatus from "./components/DbStatus.tsx";

function App() {
  return (
      <div className="app">
        <nav className="navbar">
          <span className="nav-title">ML Experiment Tracker</span>
          <div className="nav-links">
            <a href="#runs">Runs</a>
            <a href="#hyperparameters">Hyperparameters</a>
            <a href="#search">Search</a>
            <a href="#analytics">Analytics</a>
          </div>
          <DbStatus />
        </nav>

        <main className="main-content">
          <section id="runs" className="section">
            <h2>Experiment Runs</h2>
            <p className="section-desc">View, log, and delete experiment runs.</p>
          </section>

          <section id="hyperparameters" className="section">
            <h2>Hyperparameters</h2>
            <p className="section-desc">View and update hyperparameter definitions.</p>
          </section>

          <section id="search" className="section">
            <h2>Search</h2>
            <p className="section-desc">Filter runs by any combination of conditions.</p>
          </section>

          <section id="analytics" className="section">
            <h2>Analytics</h2>
            <p className="section-desc">Explore trends across experiments.</p>
          </section>
        </main>
      </div>
  )
}

export default App
