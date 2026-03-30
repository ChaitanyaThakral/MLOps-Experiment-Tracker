import { useState, useEffect } from 'react';
import { fetchRuns } from '../api';

const COLUMNS = [
  'Run ID',
  'Start Time',
  'End Time',
  'Status',
  'Project ID',
  'Model ID',
  'Dataset ID',
  'Config ID',
];

interface RunsTableProps {
  refreshKey?: number;
}

export default function RunsTable({ refreshKey }: RunsTableProps) {
  const [rows, setRows] = useState<unknown[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    fetchRuns()
      .then((data) => setRows(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [refreshKey]);

  if (loading) return <p className="msg-empty">Loading runs...</p>;
  if (error)
    return (
      <p className="msg-error">Could not load runs. Is the backend running?</p>
    );

  return (
    <div>
      <table id="runs-table">
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={COLUMNS.length} className="msg-empty">
                No runs found.
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={i}>
                {(row as unknown[]).map((cell, j) => (
                  <td key={j}>
                    {cell !== null && cell !== undefined ? String(cell) : '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
