import { useState } from 'react';
import { fetchRunsPerProject } from '../api/index';

export default function ProjectRunsCount() {
  const [results, setResults] = useState<Record<string, unknown>[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleExecute = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchRunsPerProject();
      setResults(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="analytics-card filter-form"
      style={{ marginBottom: '2rem' }}
    >
      <h3>1. Count Runs Per Project</h3>
      <p className="section-desc">
        <strong>Aggregation with GROUP BY:</strong> Find the total number of
        experimental runs executed per project instance.
      </p>

      <div className="submit-group">
        <button onClick={handleExecute} className="primary" disabled={loading}>
          {loading ? 'Executing...' : 'Run Query'}
        </button>
      </div>

      {error && (
        <p className="msg-error results-error">
          Failed. Is the backend running?
        </p>
      )}

      {results && (
        <div
          className="table-container results-container"
          style={{ marginTop: '1rem' }}
        >
          <h4>Results ({results.length})</h4>
          <table>
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Total Runs</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan={2} className="msg-empty">
                    No data found.
                  </td>
                </tr>
              ) : (
                results.map((row, i) => (
                  <tr key={i}>
                    <td>
                      {row.PROJECT_ID !== null && row.PROJECT_ID !== undefined
                        ? String(row.PROJECT_ID)
                        : '—'}
                    </td>
                    <td>
                      {row.RUN_COUNT !== null && row.RUN_COUNT !== undefined
                        ? String(row.RUN_COUNT)
                        : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
