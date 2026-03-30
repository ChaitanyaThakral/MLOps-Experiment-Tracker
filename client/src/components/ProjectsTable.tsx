import { useState, useEffect } from 'react';
import { fetchProjects } from '../api';

const COLUMNS = ['Project ID', 'Name', 'Deadline', 'Start Date'];

export default function ProjectsTable() {
  const [rows, setRows] = useState<unknown[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    fetchProjects()
      .then((data) => setRows(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p className="msg-empty">Loading projects...</p>;
  if (error)
    return (
      <p className="msg-error">
        Could not load projects. Is the backend running?
      </p>
    );

  return (
    <div>
      <table id="projects-table">
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
                No projects found.
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
