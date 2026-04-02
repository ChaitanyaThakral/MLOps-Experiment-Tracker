import { useState, type FormEvent } from 'react';
import { fetchProjectRuns } from '../api/index';

const ALL_ATTRIBUTES = [
  'run_id',
  'start_time',
  'end_time',
  'execution_status',
  'project_id',
  'model_id',
  'dataset_id',
  'config_id',
];

export default function RunProjection() {
  const [available, setAvailable] = useState<string[]>([...ALL_ATTRIBUTES]);
  const [selected, setSelected] = useState<string[]>([]);
  const [results, setResults] = useState<Record<string, unknown>[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSelect = (attr: string) => {
    setAvailable(available.filter((a) => a !== attr));
    setSelected([...selected, attr]);
  };

  const handleDeselect = (attr: string) => {
    setSelected(selected.filter((s) => s !== attr));
    setAvailable([...available, attr]);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newSelected = [...selected];
    const temp = newSelected[index - 1];
    newSelected[index - 1] = newSelected[index];
    newSelected[index] = temp;
    setSelected(newSelected);
  };

  const moveDown = (index: number) => {
    if (index === selected.length - 1) return;
    const newSelected = [...selected];
    const temp = newSelected[index + 1];
    newSelected[index + 1] = newSelected[index];
    newSelected[index] = temp;
    setSelected(newSelected);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (selected.length === 0) {
      alert('Please select at least one column to project.');
      return;
    }

    setLoading(true);
    setError(false);
    try {
      const data = await fetchProjectRuns({ attributes: selected });
      setResults(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="projection-picker">
      <form
        onSubmit={handleSubmit}
        className="log-run-form filter-form"
        style={{ marginTop: '24px' }}
      >
        <h3>Columns Projection</h3>
        <p className="section-desc">
          Choose which attributes to view and order them. Non-selected
          attributes won't be queried.
        </p>

        <div className="projection-container">
          <div className="projection-list">
            <h4>Available Columns</h4>
            <div className="list-box">
              {available.length === 0 && (
                <span className="msg-empty">All selected</span>
              )}
              {available.map((attr) => (
                <div key={attr} className="list-item">
                  <span>{attr}</span>
                  <button
                    type="button"
                    onClick={() => handleSelect(attr)}
                    className="add-col-btn"
                  >
                    Add ➔
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="projection-list">
            <h4>Selected Columns (in order)</h4>
            <div className="list-box">
              {selected.length === 0 && (
                <span className="msg-empty">None selected</span>
              )}
              {selected.map((attr, idx) => (
                <div key={attr} className="list-item">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => handleDeselect(attr)}
                      className="remove-col-btn"
                      title="Remove"
                    >
                      ✕
                    </button>
                    <span>{attr}</span>
                  </div>
                  <div className="order-btns">
                    <button
                      type="button"
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      title="Move Up"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(idx)}
                      disabled={idx === selected.length - 1}
                      title="Move Down"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="submit-group">
          <button
            type="submit"
            className="primary"
            disabled={loading || selected.length === 0}
          >
            {loading ? 'Projecting...' : 'View Selection'}
          </button>
        </div>
      </form>

      {error && (
        <p className="msg-error results-error">
          Failed to execute projection query.
        </p>
      )}

      {results && (
        <div className="table-container results-container">
          <h4>Projection Results ({results.length})</h4>
          <table>
            <thead>
              <tr>
                {selected.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan={selected.length} className="msg-empty">
                    No runs found.
                  </td>
                </tr>
              ) : (
                results.map((row, i) => (
                  <tr key={i}>
                    {selected.map((col, j) => {
                      const cell = row[col.toUpperCase()];
                      return (
                        <td key={j}>
                          {cell !== null && cell !== undefined
                            ? String(cell)
                            : '—'}
                        </td>
                      );
                    })}
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
