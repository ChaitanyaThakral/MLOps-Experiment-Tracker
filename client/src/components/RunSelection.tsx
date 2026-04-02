import { useState, type FormEvent } from 'react';
import { fetchSelectRuns, type SelectClause } from '../api/index';

const ATTRIBUTES = [
  { value: 'run_id', label: 'Run ID' },
  { value: 'execution_status', label: 'Status' },
  { value: 'project_id', label: 'Project ID' },
  { value: 'model_id', label: 'Model ID' },
  { value: 'dataset_id', label: 'Dataset ID' },
  { value: 'config_id', label: 'Config ID' },
];

const OPERATORS = ['=', '!=', '>', '<', '>=', '<='];

export default function RunSelection() {
  const [clauses, setClauses] = useState<SelectClause[]>([
    { logical_op: '', attribute: 'run_id', operator: '=', value: '' },
  ]);
  const [results, setResults] = useState<Record<string, unknown>[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const addClause = (logic: 'AND' | 'OR') => {
    setClauses([
      ...clauses,
      { logical_op: logic, attribute: 'run_id', operator: '=', value: '' },
    ]);
  };

  const removeClause = (index: number) => {
    const newClauses = clauses.filter((_, i) => i !== index);
    if (newClauses.length > 0) {
      newClauses[0].logical_op = '';
    }
    setClauses(newClauses);
  };

  const updateClause = (
    index: number,
    field: keyof SelectClause,
    value: string
  ) => {
    const newClauses = [...clauses];
    newClauses[index] = { ...newClauses[index], [field]: value };
    setClauses(newClauses);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const data = await fetchSelectRuns({ conditions: clauses });
      setResults(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="selection-builder">
      <form onSubmit={handleSubmit} className="log-run-form filter-form">
        <h3>Search Runs</h3>
        <p className="section-desc">
          Add conditions below to find specific runs.
        </p>

        <div className="filter-container">
          {clauses.map((clause, i) => (
            <div key={i} className="form-row uses-row filter-row">
              <div
                className={`form-group logic-group ${i === 0 ? 'hidden-logic' : ''}`}
              >
                <label>Logic</label>
                <select
                  value={clause.logical_op}
                  onChange={(e) =>
                    updateClause(i, 'logical_op', e.target.value)
                  }
                  disabled={i === 0}
                >
                  <option value="AND">AND</option>
                  <option value="OR">OR</option>
                </select>
              </div>

              <div className="form-group">
                <label>Field</label>
                <select
                  value={clause.attribute}
                  onChange={(e) => updateClause(i, 'attribute', e.target.value)}
                >
                  {ATTRIBUTES.map((attr) => (
                    <option key={attr.value} value={attr.value}>
                      {attr.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group operator-group">
                <label>Is</label>
                <select
                  value={clause.operator}
                  onChange={(e) => updateClause(i, 'operator', e.target.value)}
                >
                  {OPERATORS.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Value</label>
                <input
                  type="text"
                  required
                  value={clause.value}
                  onChange={(e) => updateClause(i, 'value', e.target.value)}
                />
              </div>

              {clauses.length > 1 && (
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeClause(i)}
                  title="Remove Filter"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <div className="filter-actions">
            <button
              type="button"
              onClick={() => addClause('AND')}
              className="add-btn"
            >
              + AND Condition
            </button>
            <button
              type="button"
              onClick={() => addClause('OR')}
              className="add-btn"
            >
              + OR Condition
            </button>
          </div>
        </div>

        <div className="submit-group">
          <button type="submit" className="primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search Runs'}
          </button>
        </div>
      </form>

      {error && (
        <p className="msg-error results-error">
          Failed to execute search query. Is the backend running?
        </p>
      )}

      {results && (
        <div className="table-container results-container">
          <h4>Search Results ({results.length})</h4>
          <table>
            <thead>
              <tr>
                <th>Run ID</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Status</th>
                <th>Project ID</th>
                <th>Model ID</th>
                <th>Dataset ID</th>
                <th>Config ID</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan={8} className="msg-empty">
                    No runs match your search filters.
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
                      {row.START_TIME !== null && row.START_TIME !== undefined
                        ? String(row.START_TIME)
                        : '—'}
                    </td>
                    <td>
                      {row.END_TIME !== null && row.END_TIME !== undefined
                        ? String(row.END_TIME)
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
                      {row.MODEL_ID !== null && row.MODEL_ID !== undefined
                        ? String(row.MODEL_ID)
                        : '—'}
                    </td>
                    <td>
                      {row.DATASET_ID !== null && row.DATASET_ID !== undefined
                        ? String(row.DATASET_ID)
                        : '—'}
                    </td>
                    <td>
                      {row.CONFIG_ID !== null && row.CONFIG_ID !== undefined
                        ? String(row.CONFIG_ID)
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
