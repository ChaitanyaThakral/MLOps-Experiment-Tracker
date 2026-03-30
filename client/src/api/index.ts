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
  const res = await fetch('/api/runs');
  const json = await res.json();
  return json.data ?? [];
}

export async function fetchProjects(): Promise<unknown[][]> {
  const res = await fetch('/api/projects');
  const json = await res.json();
  return json.data ?? [];
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
  const res = await fetch('/api/hyperparameters');
  const json = await res.json();
  return json.data ?? [];
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

// stubs, will implement later
// PUT /api/update-hyperparameter
// DELETE /api/delete-run/:id
// POST /api/select-runs
// POST /api/project-runs
// POST /api/join-runs-projects
