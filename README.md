# MLOps Experiment Tracker

A high-performance, full-stack MLOps tracking platform designed to log, manage, and analyze complex machine learning lifecycles. Built with a robust Oracle SQL backend and a responsive TypeScript/React frontend, this project ensures rigorous data integrity and fast, dynamic querying for experiment tracking.

## 🚀 Key Architectural Features

- **Robust Data Architecture:** Engineered a 16-entity **BCNF Oracle SQL schema** that guarantees 100% data integrity. Leverages cascading constraints and strict foreign key relationships to ensure zero orphan records across highly complex ML lifecycle tracking.
- **High-Performance API:** Architected a Node.js REST API utilizing optimized Oracle connection pooling. Delivers sub-50ms query execution across high-throughput endpoints.
- **Security First:** Secured the data layer using strictly parameterized queries to prevent SQL injection vulnerabilities, safely syncing high-throughput logs to the UI.
- **Modern Frontend Client:** A seamless, interactive TypeScript and React UI built on Vite, enabling researchers to instantly visualize configurations, filter run metrics, and drill down into hyperparameters.

## 💻 Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Backend:** Node.js, Express.js
- **Database:** Oracle Database (`oracledb` Node client)
- **Deployment & Tooling:** Environment-based configuration, shell scripts for scalable deployment

## 📊 Advanced Relational Operations

The API provides deep insights into the ML lifecycle using advanced relational algebra mapped to dynamic SQL, including:

- **Selection & Filtering (`/select-runs`):** Dynamic condition generation to pinpoint specific ML runs based on execution status or configurations.
- **Projection (`/project-runs`):** Dynamically select specific attributes across multiple experiment configurations.
- **Join (`/join-runs-metrics`):** Equi-joins across Runs and Metrics to identify models that meet specific performance thresholds.
- **Aggregation (`/runs-per-project`):** `GROUP BY` operations to analyze run frequencies across different overarching ML projects.
- **Nested Aggregation (`/projects-with-min-runs`, `/best-projects-by-metric`):** Utilizing `HAVING` clauses and subqueries to filter projects based on aggregate conditions (e.g., projects with more than *N* runs, or the absolute best metric across all projects).
- **Relational Division (`/runs-with-all-required-hyperparameters`):** Complex division queries identifying runs that perfectly satisfy all mandated hyperparameter configurations.

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- Access to an Oracle Database instance
- Git

### 1. Database Configuration
Create a `.env` file in the root directory:
```env
ORACLE_USER=ora_YOUR_USERNAME
ORACLE_PASS=aYOUR_PASSWORD
PORT=65535
ORACLE_HOST=dbhost.example.com
ORACLE_PORT=1522
ORACLE_DBNAME=dbname
```

### 2. Install Dependencies
Install packages for both the root server and the client:
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Run the Application
You can run the frontend and backend servers together for local development:
```bash
# Start backend API (Root directory):
node server.js

# Start frontend UI (In a new terminal window):
cd client
npm run dev
```

## 🔐 Security & Reliability
- **Connection Pooling:** Reduces overhead on the Oracle DB, allowing the tracker to handle concurrent, high-frequency experiment logging.
- **Data Consistency:** BCNF guarantees no update anomalies, while SQL-level cascading deletes ensure clean environments when a project or run is removed.
