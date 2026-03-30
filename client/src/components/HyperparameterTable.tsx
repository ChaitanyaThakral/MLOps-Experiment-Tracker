import { useState, useEffect, type ChangeEvent } from 'react';
import {
  fetchHyperparameters,
  updateHyperparameter,
  type HyperparameterUpdatePayload,
} from '../api/index';

const ERROR_MESSAGES: Record<string, string> = {
  DUPLICATE_NAME:
    'That hyperparameter name is already in use. Names must be unique.',
};

export default function HyperparameterTable() {
  const [rows, setRows] = useState<unknown[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<HyperparameterUpdatePayload | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const load = () => {
    setLoading(true);
    setError(false);
    fetchHyperparameters()
      .then((data) => {
        setRows(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, []);

  const handleEditClick = (row: unknown[]) => {
    setMessage(null);
    setEditingId(Number(row[0]));
    setEditForm({
      parameter_id: Number(row[0]),
      hyperparam_name: String(row[1] || ''),
      default_value: String(row[2] || ''),
      is_required: String(row[3] || 'N'),
      datatype: String(row[4] || ''),
    });
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleEditChange =
    (field: keyof HyperparameterUpdatePayload) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (!editForm) return;
      setEditForm({ ...editForm, [field]: e.target.value });
    };

  const handleSave = async () => {
    if (!editForm) return;

    if (!editForm.hyperparam_name.trim()) {
      setMessage({
        type: 'error',
        text: 'Hyperparameter name cannot be empty.',
      });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const result = await updateHyperparameter(editForm);
      if (result.success) {
        setMessage({
          type: 'success',
          text: `Hyperparameter #${editForm.parameter_id} updated successfully.`,
        });
        setEditingId(null);
        setEditForm(null);
        load();
      } else {
        const errCode = result.error ?? '';
        const friendly = ERROR_MESSAGES[errCode] ?? `Update failed: ${errCode}`;
        setMessage({ type: 'error', text: friendly });
      }
    } catch {
      setMessage({ type: 'error', text: 'Could not reach the server.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="msg-loading">Loading hyperparameters...</p>;
  if (error)
    return (
      <p className="msg-error">
        Failed to load hyperparameters. Is the backend running?
      </p>
    );

  return (
    <div className="table-container">
      {message && (
        <p
          className={message.type === 'success' ? 'msg-success' : 'msg-error'}
          style={{ marginBottom: '16px' }}
        >
          {message.text}
        </p>
      )}

      {rows.length === 0 ? (
        <p className="msg-info">No hyperparameters found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Default Value</th>
              <th>Required (Y/N)</th>
              <th>Data Type</th>
              <th style={{ width: '150px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const parameter_id = Number(row[0]);
              const isEditing = editingId === parameter_id;

              if (isEditing && editForm) {
                return (
                  <tr key={parameter_id} className="editing-row">
                    <td>{parameter_id}</td>
                    <td>
                      <input
                        type="text"
                        value={editForm.hyperparam_name}
                        onChange={handleEditChange('hyperparam_name')}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editForm.default_value}
                        onChange={handleEditChange('default_value')}
                      />
                    </td>
                    <td>
                      <select
                        value={editForm.is_required}
                        onChange={handleEditChange('is_required')}
                      >
                        <option value="Y">Y</option>
                        <option value="N">N</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editForm.datatype}
                        onChange={handleEditChange('datatype')}
                      />
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="primary small"
                          onClick={handleSave}
                          disabled={saving}
                        >
                          {saving ? '...' : 'Save'}
                        </button>
                        <button
                          className="secondary small"
                          onClick={handleCancelClick}
                          disabled={saving}
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }
              return (
                <tr key={parameter_id}>
                  <td>{parameter_id}</td>
                  <td>{String(row[1])}</td>
                  <td>{String(row[2] || '')}</td>
                  <td>{String(row[3])}</td>
                  <td>{String(row[4])}</td>
                  <td>
                    <button
                      className="secondary small"
                      onClick={() => handleEditClick(row)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
