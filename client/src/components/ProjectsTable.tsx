import { useState, useEffect } from 'react';
import { fetchProjects } from '../api';

const COLUMNS = ['Project ID', 'Name', 'Deadline', 'Start Date'];

export default function ProjectsTable() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
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
                <td>
                  {row.PROJECT_ID !== null && row.PROJECT_ID !== undefined
                    ? String(row.PROJECT_ID)
                    : '—'}
                </td>
                <td>
                  {row.PROJECT_NAME !== null && row.PROJECT_NAME !== undefined
                    ? String(row.PROJECT_NAME)
                    : row.NAME !== null && row.NAME !== undefined
                      ? String(row.NAME)
                      : '—'}
                </td>
                <td>
                  {row.DEADLINE !== null && row.DEADLINE !== undefined
                    ? String(row.DEADLINE)
                    : row.END_DATE !== null && row.END_DATE !== undefined
                      ? String(row.END_DATE)
                      : '—'}
                </td>
                <td>
                  {row.START_DATE !== null && row.START_DATE !== undefined
                    ? String(row.START_DATE)
                    : '—'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
