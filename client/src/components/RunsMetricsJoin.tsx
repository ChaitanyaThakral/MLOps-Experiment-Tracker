import { useState, useEffect, type FormEvent } from 'react';
import { fetchJoinRunsMetrics, fetchMetricTypes } from '../api/index';

export default function RunsMetricsJoin() {
  const [metricName, setMetricName] = useState('');
  const [metricOptions, setMetricOptions] = useState<string[]>([]);
  const [maxValue, setMaxValue] = useState<number | ''>('');

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (maxValue === '') return;

    setLoading(true);
    setError(false);
    try {
      const data = await fetchJoinRunsMetrics({
        metric_name: metricName,
        max_value: Number(maxValue),
      });
      setResults(data as Record<string, unknown>[]);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="join-container">
      <form
        onSubmit={handleSubmit}
        className="log-run-form filter-form"
        style={{ marginTop: '24px' }}
      >
        <h3>Join: Runs & Metrics</h3>
        <p className="section-desc">
          Find runs paired with their metrics where the metric value is under a
          certain threshold.
        </p>

        <div className="filter-container">
          <div className="form-row uses-row filter-row">
            <div className="form-group">
              <label>Metric Name</label>
              <select
                value={metricName}
                onChange={(e) => setMetricName(e.target.value)}
              >
                {metricOptions.length === 0 && (
                  <option value="">Loading...</option>
                )}
                {metricOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Max Value Limit</label>
              <input
                type="number"
                step="any"
                required
                value={maxValue}
                onChange={(e) =>
                  setMaxValue(
                    e.target.value === '' ? '' : Number(e.target.value)
                  )
                }
                placeholder="e.g. 0.8"
              />
            </div>
          </div>
        </div>

        <div className="submit-group">
          <button
            type="submit"
            className="primary"
            disabled={loading || maxValue === ''}
          >
            {loading ? 'Joining...' : 'Execute Join'}
          </button>
        </div>
      </form>

      {error && (
        <p className="msg-error results-error">Failed to execute join query.</p>
      )}

      {results && (
        <div className="table-container results-container">
          <h4>Join Results ({results.length})</h4>
          <table>
            <thead>
              <tr>
                <th>Run ID</th>
                <th>Status</th>
                <th>Project ID</th>
                <th>Metric Name</th>
                <th>Metric Value</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan={6} className="msg-empty">
                    No matching runs found.
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
                    <td>
                      {row.EXECUTION_STATUS !== null &&
                      row.EXECUTION_STATUS !== undefined
                        ? String(row.EXECUTION_STATUS)
                        : '—'}
                    </td>
                    <td>
                      {row.PROJECT_ID !== null && row.PROJECT_ID !== undefined
                        ? String(row.PROJECT_ID)
                        : '—'}
                    </td>
                    <td>
                      {row.METRIC_NAME !== null && row.METRIC_NAME !== undefined
                        ? String(row.METRIC_NAME)
                        : '—'}
                    </td>
                    <td>
                      {row.METRIC_VALUE !== null &&
                      row.METRIC_VALUE !== undefined
                        ? String(row.METRIC_VALUE)
                        : '—'}
                    </td>
                    <td>
                      {row.UNIT !== null && row.UNIT !== undefined
                        ? String(row.UNIT)
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
