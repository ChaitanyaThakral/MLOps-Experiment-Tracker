/**
 * Module for all HTTP requests to the Express backend.
 * All routes are prefixed with /api/ and Vite proxies them to http://localhost:65535
 */

export interface ApiResponse<T = unknown[]> {
  data?: T;
  success?: boolean;
  error?: string;
}

export async function checkDbConnection(): Promise<string> {
  const res = await fetch('/api/check-db-connection');
  return res.text();
}

export async function fetchRuns(): Promise<unknown[][]> {
  try {
    const res = await fetch('/api/runs');
    if (!res.ok) throw new Error('Backend not ready');
    const json = await res.json();
    return json.data ?? [];
  } catch (err) {
    console.warn('Backend unavailable. Using mock RUNS data.');
    return [
      [101, '2026-01-01T10:00:00', null, 'RUNNING', 1, 1, 1, 1],
      [
        102,
        '2026-01-02T14:30:00',
        '2026-02-02T15:45:00',
        'COMPLETED',
        1,
        2,
        1,
        2,
      ],
      [103, '2026-01-05T09:15:00', '2026-03-05T08:00:00', 'FAILED', 2, 3, 2, 3],
    ];
  }
}

export async function fetchProjects(): Promise<unknown[][]> {
  try {
    const res = await fetch('/api/projects');
    if (!res.ok) throw new Error('Backend not ready');
    const json = await res.json();
    return json.data ?? [];
  } catch (err) {
    console.warn('Backend unavailable. Using mock PROJECTS data.');
    return [
      [1, 'Computer Vision', '2026-01-01', '2026-12-31'],
      [2, 'Cool Chatbot', '2025-02-20', '2026-02-20'],
    ];
  }
}

export interface RunInsertPayload {
  run_id: number;
  execution_status: string;
  project_id: number;
  model_id: number;
  dataset_id: number;
  config_id: number;
  start_time?: string;
  end_time?: string;
}

export async function insertRun(
  payload: RunInsertPayload
): Promise<ApiResponse> {
  const res = await fetch('/api/insert-run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function fetchHyperparameters(): Promise<unknown[][]> {
  try {
    const res = await fetch('/api/hyperparameters');
    const json = await res.json();
    return json.data ?? [];
  } catch (err) {
    console.warn('Backend unavailable. Using mock HYPERPARAMETERS data.');
    return [
      [1, 'learning_rate', '0.001', 'Y', 'FLOAT'],
      [2, 'batch_size', '32', 'N', 'INTEGER'],
      [3, 'optimizer', 'adam', 'Y', 'VARCHAR'],
      [4, 'dropout_rate', '0.5', 'N', 'FLOAT'],
    ];
  }
}

export interface UsesInsertPayload {
  run_id: number;
  parameter_id: number;
  hyperparam_value: string;
}

export async function insertUses(
  payload: UsesInsertPayload
): Promise<ApiResponse> {
  const res = await fetch('/api/insert-uses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export interface HyperparameterUpdatePayload {
  parameter_id: number;
  hyperparam_name: string;
  default_value: string;
  is_required: string;
  datatype: string;
}

export async function updateHyperparameter(
  payload: HyperparameterUpdatePayload
): Promise<ApiResponse> {
  const res = await fetch('/api/update-hyperparameter', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

// stubs, will implement later
// PUT /api/update-hyperparameter
// DELETE /api/delete-run/:id
// POST /api/select-runs
// POST /api/project-runs
// POST /api/join-runs-projects
