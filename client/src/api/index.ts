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

export async function fetchRuns(): Promise<Record<string, unknown>[]> {
  const res = await fetch('/api/runs');
  if (!res.ok) throw new Error('Backend not ready');
  const json = await res.json();
  return json.data ?? [];
}

export async function fetchProjects(): Promise<Record<string, unknown>[]> {
  const res = await fetch('/api/projects');
  if (!res.ok) throw new Error('Backend not ready');
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

export async function fetchHyperparameters(): Promise<
  Record<string, unknown>[]
> {
  const res = await fetch('/api/hyperparameters');
  if (!res.ok) throw new Error('Backend not ready');
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

export async function deleteRun(runId: number): Promise<ApiResponse> {
  const res = await fetch(`/api/delete-run/${runId}`, {
    method: 'DELETE',
  });
  return res.json();
}

export interface SelectClause {
  logical_op: 'AND' | 'OR' | '';
  attribute: string;
  operator: string;
  value: string;
}

export interface SelectRunsPayload {
  conditions: SelectClause[];
}

export async function fetchSelectRuns(
  payload: SelectRunsPayload
): Promise<Record<string, unknown>[]> {
  const res = await fetch('/api/select-runs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Backend not ready');
  const json = await res.json();
  return json.data ?? [];
}

export interface ProjectRunsPayload {
  attributes: string[];
}

export async function fetchProjectRuns(
  payload: ProjectRunsPayload
): Promise<Record<string, unknown>[]> {
  const res = await fetch('/api/project-runs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Backend not ready');
  const json = await res.json();
  return json.data ?? [];
}

// stubs, will implement later
// POST /api/join-runs-projects
