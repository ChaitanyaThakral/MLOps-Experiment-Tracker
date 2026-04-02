import { useState } from 'react';
import { fetchProjectsWithMinRuns } from '../api/index';

export default function ProjectMinRuns() {
  const [minRuns, setMinRuns] = useState<number>(1);
  const [results, setResults] = useState<Record<string, unknown>[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleExecute = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchProjectsWithMinRuns(minRuns);
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
      <h3>2. Projects with Minimum Runs</h3>
      <p className="section-desc">
        <strong>Aggregation with HAVING:</strong> Find all projects that have
        executed at least the specified number of runs.
      </p>

      <div
        className="submit-group"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'flex-start',
        }}
      >
        <div className="form-group" style={{ margin: 0 }}>
          <label
            htmlFor="minRunsInput"
            style={{ display: 'block', marginBottom: '0.25rem' }}
          >
            Minimum Runs Threshold:
          </label>
          <input
            id="minRunsInput"
            type="number"
            min="1"
            value={minRuns}
            onChange={(e) => setMinRuns(Number(e.target.value))}
            style={{ width: '120px', padding: '0.5rem' }}
          />
        </div>
        <button onClick={handleExecute} className="primary" disabled={loading}>
          {loading ? 'Executing...' : 'Run Query'}
        </button>
      </div>

      {error && (
        <p className="msg-error results-error">
          Failed to query backend. Ensure minRuns is valid.
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
                <th>Run Count</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan={2} className="msg-empty">
                    No projects meet this threshold.
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
