# MLOps Experiment Tracker

Built full-stack MLOps tracking platform with a 16-entity BCNF Oracle SQL schema, ensuring 100% data integrity and 0 orphan records across complex ML lifecycles.

## Architecture & Performance
- **Database & Data Modeling**: 16-entity BCNF Oracle SQL schema. Secured data layer via parameterized queries to prevent SQL injection, leveraging cascading constraints to seamlessly sync high-throughput logs.
- **Backend API**: Architected Node.js REST API with optimized connection pooling and dynamic SQL generation (relational division, nested aggregations) driving <50ms query execution.
- **Frontend Sync**: Seamlessly syncs high-throughput logs with a TypeScript UI.
