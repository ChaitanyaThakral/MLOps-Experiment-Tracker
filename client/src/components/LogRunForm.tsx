import React, { useState } from 'react';
import { insertRun } from '../api/index';
import type { RunInsertPayload } from '../api/index';

// Maps error codes returned by backend
// Adi please return, for example, { success: false, error: 'FK_PROJECT' } etc. on constraint violations
const FK_MESSAGES: Record<string, string> = {
  FK_PROJECT: 'That Project ID does not exist. Please choose a valid project.',
  FK_MODEL: 'That Model ID does not exist. Please choose a valid model.',
  FK_DATASET: 'That Dataset ID does not exist. Please choose a valid dataset.',
  FK_CONFIG:
    'That Configuration ID does not exist. Please choose a valid configuration.',
  DUPLICATE_ID:
    'A run with that ID already exists. Please use a different Run ID.',
};

const STATUS = ['COMPLETED', 'FAILED', 'RUNNING'];

const EMPTY_FORM = {
  run_id: '',
  execution_status: 'COMPLETED',
  project_id: '',
  model_id: '',
  dataset_id: '',
  config_id: '',
  start_time: '',
  end_time: '',
};

export default function LogRunForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const set =
    (field: keyof typeof EMPTY_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setMessage(null);
    };

  const validate = (): string | null => {
    if (!form.run_id || isNaN(Number(form.run_id)))
      return 'Run ID must be a number.';
    if (!form.project_id || isNaN(Number(form.project_id)))
      return 'Project ID must be a number.';
    if (!form.model_id || isNaN(Number(form.model_id)))
      return 'Model ID must be a number.';
    if (!form.dataset_id || isNaN(Number(form.dataset_id)))
      return 'Dataset ID must be a number.';
    if (!form.config_id || isNaN(Number(form.config_id)))
      return 'Configuration ID must be a number.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setMessage({ type: 'error', text: validationError });
      return;
    }

    const payload: RunInsertPayload = {
      run_id: Number(form.run_id),
      execution_status: form.execution_status,
      project_id: Number(form.project_id),
      model_id: Number(form.model_id),
      dataset_id: Number(form.dataset_id),
      config_id: Number(form.config_id),
      start_time: form.start_time || undefined,
      end_time: form.end_time || undefined,
    };

    setSubmitting(true);
    try {
      const result = await insertRun(payload);
      if (result.success) {
        setMessage({
          type: 'success',
          text: `Run #${form.run_id} logged successfully.`,
        });
        setForm(EMPTY_FORM);
        onSuccess();
      } else {
        const errorCode = result.error ?? '';
        const friendly =
          FK_MESSAGES[errorCode] ?? `Insert failed: ${errorCode}`;
        setMessage({ type: 'error', text: friendly });
      }
    } catch {
      setMessage({
        type: 'error',
        text: 'Could not reach the server. Is the backend running?',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form id="log-run-form" onSubmit={handleSubmit} className="log-run-form">
      <h3>Log a New Run</h3>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="run_id">Run ID</label>
          <input
            id="run_id"
            type="number"
            value={form.run_id}
            onChange={set('run_id')}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="execution_status">Status</label>
          <select
            id="execution_status"
            value={form.execution_status}
            onChange={set('execution_status')}
          >
            {STATUS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="project_id">Project ID</label>
          <input
            id="project_id"
            type="number"
            value={form.project_id}
            onChange={set('project_id')}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="model_id">Model ID</label>
          <input
            id="model_id"
            type="number"
            value={form.model_id}
            onChange={set('model_id')}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="dataset_id">Dataset ID</label>
          <input
            id="dataset_id"
            type="number"
            value={form.dataset_id}
            onChange={set('dataset_id')}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="config_id">Configuration ID</label>
          <input
            id="config_id"
            type="number"
            value={form.config_id}
            onChange={set('config_id')}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="start_time">Start Time</label>
          <input
            id="start_time"
            type="datetime-local"
            value={form.start_time}
            onChange={set('start_time')}
          />
        </div>

        <div className="form-group">
          <label htmlFor="end_time">End Time</label>
          <input
            id="end_time"
            type="datetime-local"
            value={form.end_time}
            onChange={set('end_time')}
          />
        </div>
      </div>

      <button type="submit" className="primary" disabled={submitting}>
        {submitting ? 'Logging...' : 'Log Run'}
      </button>

      {message && (
        <p className={message.type === 'success' ? 'msg-success' : 'msg-error'}>
          {message.text}
        </p>
      )}
    </form>
  );
}
