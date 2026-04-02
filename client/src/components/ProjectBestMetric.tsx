import { useState, useEffect } from 'react';
import { fetchBestProjectsByMetric, fetchMetricTypes } from '../api/index';

export default function ProjectBestMetric() {
  const [metricName, setMetricName] = useState('');
  const [metricOptions, setMetricOptions] = useState<string[]>([]);
  const [results, setResults] = useState<Record<string, unknown>[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadOptions() {
      const options = await fetchMetricTypes();
      setMetricOptions(options);
      if (options.length > 0) {
        setMetricName(options[0]);
      }
    }
    loadOptions();
  }, []);

  const handleExecute = async () => {
    if (!metricName) return;
    setLoading(true);
    setError(false);
    try {
      const data = await fetchBestProjectsByMetric(metricName);
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
      <h3>3. Best Projects By Metric</h3>
      <p className="section-desc">
        <strong>Nested Aggregation with GROUP BY:</strong> Find the projects
        whose average metric score is better than all other projects' averages.
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
            htmlFor="metricSelect"
            style={{ display: 'block', marginBottom: '0.25rem' }}
          >
            Select Target Metric:
          </label>
          <select
            id="metricSelect"
            value={metricName}
            onChange={(e) => setMetricName(e.target.value)}
            style={{ width: '200px', padding: '0.5rem' }}
          >
            {metricOptions.length === 0 && (
              <option value="">Loading metrics...</option>
            )}
            {metricOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleExecute}
          className="primary"
          disabled={loading || !metricName}
        >
          {loading ? 'Executing...' : 'Run Query'}
        </button>
      </div>

      {error && (
        <p className="msg-error results-error">
          Failed query. Is the backend running?
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
                <th>Overall Average Score</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan={2} className="msg-empty">
                    No projects have logged this metric.
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
                      {row.AVG_METRIC !== null && row.AVG_METRIC !== undefined
                        ? Number(row.AVG_METRIC).toFixed(4)
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
