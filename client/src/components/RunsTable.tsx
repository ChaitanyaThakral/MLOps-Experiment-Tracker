import { useState, useEffect } from 'react';
import { deleteRun, fetchRuns } from '../api';

const COLUMNS = [
  'Run ID',
  'Start Time',
  'End Time',
  'Status',
  'Project ID',
  'Model ID',
  'Dataset ID',
  'Config ID',
  'Actions',
];

interface RunsTableProps {
  refreshKey?: number;
}

export default function RunsTable({ refreshKey }: RunsTableProps) {
  const [rows, setRows] = useState<unknown[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    setError(false);
    fetchRuns()
      .then((data) => setRows(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (runId: number) => {
    if (
      !window.confirm(
        `Delete Run #${runId}? This will permanently remove all associated metrics and hyperparameter usage records.`
      )
    ) {
      return;
    }

    setDeletingId(runId);
    setMessage(null);

    try {
      const result = await deleteRun(runId);
      if (result.success) {
        setMessage({
          type: 'success',
          text: `Run #${runId} deleted successfully.`,
        });
        load();
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Failed to delete run.',
        });
      }
    } catch {
      setMessage({
        type: 'error',
        text: 'Could not reach the backend to delete the run.',
      });
    } finally {
      setDeletingId(null);
    }
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
      {message && (
        <p
          className={message.type === 'success' ? 'msg-success' : 'msg-error'}
          style={{ marginBottom: '16px' }}
        >
          {message.text}
        </p>
      )}
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
            rows.map((row, i) => {
              const runId = Number(row[0]);
              return (
                <tr key={i}>
                  {(row as unknown[]).map((cell, j) => (
                    <td key={j}>
                      {cell !== null && cell !== undefined ? String(cell) : '—'}
                    </td>
                  ))}
                  <td>
                    <button
                      className="secondary small"
                      onClick={() => handleDelete(runId)}
                      disabled={deletingId === runId}
                    >
                      {deletingId === runId ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
