import { useState } from 'react';
import { fetchRunsAllHyperparameters } from '../api/index';

export default function RunsAllHyperparameters() {
  const [results, setResults] = useState<Record<string, unknown>[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleExecute = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchRunsAllHyperparameters();
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
      <h3>4. Runs With All Required Hyperparameters</h3>
      <p className="section-desc">
        <strong>Relational Division:</strong> Find every single experimental Run
        that implements all required hyperparameters defined.
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
          style={{ marginTop: '1rem', width: '300px' }}
        >
          <h4>Compliant Runs ({results.length})</h4>
          <table>
            <thead>
              <tr>
                <th>Run ID</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td className="msg-empty">
                    No runs satisfy all requirements.
                  </td>
                </tr>
              ) : (
                results.map((row, i) => (
                  <tr key={i}>
                    <td>
                      {row.RUN_ID !== null && row.RUN_ID !== undefined
                        ? String(row.RUN_ID)
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
